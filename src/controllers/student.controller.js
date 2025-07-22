import Student from "../models/student.models.js";
import Course from "../models/course.models.js";
import Enrollment from "../models/enrollment.models.js";
import Attendance from "../models/attendance.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const studentsHandler = asyncHandler(async (req, res) => {
  try {
    const students = await Student.find({ status: "active" }).sort({
      enrollmentDate: -1,
    });

    const studentsWithDetails = await Promise.all(
      students.map(async (student) => {
        const enrollmentCount = await Enrollment.countDocuments({
          studentId: student._id,
          status: "enrolled",
        });

        const primaryEnrollment = await Enrollment.findOne({
          studentId: student._id,
          status: "enrolled",
        }).populate("courseId");

        return {
          ...student.toObject(),
          id: student._id,
          name: student.fullName,
          courseCount: enrollmentCount,
          course: primaryEnrollment
            ? primaryEnrollment.courseId.title
            : "Not Enrolled",
        };
      })
    );

    res.render("pages/students", {
      title: "Students",
      user: req.user,
      students: studentsWithDetails,
      currentPage: "students",
      pageCSS: "students",
      pageJS: "students",
      success: req.query.success,
      error: req.query.error,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).render("pages/error", {
      title: "Error",
      statusCode: 500,
      error: "Internal Server Error",
      message: "Could not fetch students data",
    });
  }
});

export const studentDetailHandler = asyncHandler(async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).render("pages/404");
    }

    // Get student's enrollments with course details
    const enrollments = await Enrollment.find({
      studentId: student._id,
      status: "enrolled",
    }).populate("courseId");

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAttendance = await Attendance.find({
      studentId: student._id,
      date: { $gte: thirtyDaysAgo },
    }).populate("courseId");

    const totalClasses = recentAttendance.length;
    const presentClasses = recentAttendance.filter(
      (att) => att.status === "present"
    ).length;
    const attendancePercentage =
      totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

    const studentData = {
      ...student.toObject(),
      id: student._id,
      name: student.fullName,
      course:
        enrollments.length > 0 ? enrollments[0].courseId.title : "Not Enrolled",
      courseId: enrollments.length > 0 ? enrollments[0].courseId._id : null,
      courses: enrollments.map((e) => e.courseId),
      attendancePercentage,
      totalClasses,
      presentClasses,
    };

    res.render("pages/student-profile", {
      title: "Student Profile",
      user: req.user,
      student: studentData,
      currentPage: "students",
      pageCSS: "student-profile",
      pageJS: "student-profile",
      success: req.query.success,
      error: req.query.error,
    });
  } catch (error) {
    console.error("Error fetching student details:", error);

    if (error.name === "CastError") {
      return res.status(404).render("pages/404");
    }

    res.status(500).render("pages/error", {
      title: "Error",
      statusCode: 500,
      error: "Internal Server Error",
      message: "Could not fetch student details",
    });
  }
});

// ===== ADD NEW STUDENT =====
export const addStudentPage = asyncHandler(async (req, res) => {
  try {
    // Get all active courses for enrollment options
    const courses = await Course.find({ status: "active" }).select(
      "title code"
    );

    res.render("pages/student-add", {
      title: "Add New Student",
      user: req.user,
      courses: courses,
      currentPage: "students",
      pageCSS: "students",
      pageJS: "student-form",
    });
  } catch (error) {
    console.error("Error loading add student page:", error);
    res.status(500).render("pages/error", {
      title: "Error",
      statusCode: 500,
      error: "Internal Server Error",
      message: "Could not load add student page",
    });
  }
});

export const createStudent = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, phone, gender, dob, address, courseId } = req.body;

    // Basic validation
    if (!fullName || !email) {
      return res.status(400).render("pages/student-add", {
        title: "Add New Student",
        user: req.user,
        courses: await Course.find({ status: "active" }).select("title code"),
        currentPage: "students",
        pageCSS: "students",
        pageJS: "student-form",
        error: "Full name and email are required",
        formData: req.body,
      });
    }

    // Check if email already exists
    const existingStudent = await Student.findOne({
      email: email.toLowerCase(),
    });
    if (existingStudent) {
      return res.status(400).render("pages/student-add", {
        title: "Add New Student",
        user: req.user,
        courses: await Course.find({ status: "active" }).select("title code"),
        currentPage: "students",
        pageCSS: "students",
        pageJS: "student-form",
        error: "Email already exists",
        formData: req.body,
      });
    }

    // Create new student
    const newStudent = await Student.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      gender: gender,
      dob: dob ? new Date(dob) : null,
      address: address?.trim(),
      enrollmentDate: new Date(),
      status: "active",
    });

    // If course is selected, create enrollment
    if (courseId && courseId !== "") {
      await Enrollment.create({
        studentId: newStudent._id,
        courseId: courseId,
        enrollmentDate: new Date(),
        status: "enrolled",
      });
    }

    res.redirect(`/students?success=Student created successfully`);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).render("pages/student-add", {
      title: "Add New Student",
      user: req.user,
      courses: await Course.find({ status: "active" }).select("title code"),
      currentPage: "students",
      pageCSS: "students",
      pageJS: "student-form",
      error: "Failed to create student. Please try again.",
      formData: req.body,
    });
  }
});

// ===== EDIT STUDENT =====
export const editStudentPage = asyncHandler(async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).render("pages/404");
    }

    // Get all courses for enrollment options
    const courses = await Course.find({ status: "active" }).select(
      "title code"
    );

    // Get current enrollment
    const currentEnrollment = await Enrollment.findOne({
      studentId: student._id,
      status: "enrolled",
    }).populate("courseId");

    const studentData = {
      ...student.toObject(),
      dob: student.dob ? student.dob.toISOString().split("T")[0] : "",
      currentCourseId: currentEnrollment
        ? currentEnrollment.courseId._id.toString()
        : "",
    };

    res.render("pages/student-edit", {
      title: "Edit Student",
      user: req.user,
      student: studentData,
      courses: courses,
      currentPage: "students",
      pageCSS: "students",
      pageJS: "student-form",
    });
  } catch (error) {
    console.error("Error loading edit student page:", error);
    if (error.name === "CastError") {
      return res.status(404).render("pages/404");
    }
    res.status(500).render("pages/error", {
      title: "Error",
      statusCode: 500,
      error: "Internal Server Error",
      message: "Could not load edit student page",
    });
  }
});

export const updateStudent = asyncHandler(async (req, res) => {
  try {
    const studentId = req.params.id;
    const { fullName, email, phone, gender, dob, address, courseId, status } =
      req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).render("pages/404");
    }

    // Basic validation
    if (!fullName || !email) {
      return res.redirect(
        `/students/${studentId}/edit?error=Full name and email are required`
      );
    }

    // Check if email already exists (excluding current student)
    const existingStudent = await Student.findOne({
      email: email.toLowerCase(),
      _id: { $ne: studentId },
    });
    if (existingStudent) {
      return res.redirect(
        `/students/${studentId}/edit?error=Email already exists`
      );
    }

    // Update student data
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone?.trim(),
        gender: gender,
        dob: dob ? new Date(dob) : null,
        address: address?.trim(),
        status: status || "active",
      },
      { new: true }
    );

    // Handle course enrollment changes
    if (courseId !== undefined) {
      // Remove current enrollment
      await Enrollment.updateMany(
        { studentId: studentId, status: "enrolled" },
        { status: "dropped" }
      );

      // Add new enrollment if course is selected
      if (courseId && courseId !== "") {
        await Enrollment.create({
          studentId: studentId,
          courseId: courseId,
          enrollmentDate: new Date(),
          status: "enrolled",
        });
      }
    }

    res.redirect(`/students/${studentId}?success=Student updated successfully`);
  } catch (error) {
    console.error("Error updating student:", error);
    res.redirect(
      `/students/${req.params.id}/edit?error=Failed to update student`
    );
  }
});

// ===== DELETE STUDENT =====
export const deleteStudent = asyncHandler(async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Soft delete - change status to inactive instead of actual deletion
    await Student.findByIdAndUpdate(studentId, { status: "inactive" });

    // Also update enrollments to dropped
    await Enrollment.updateMany(
      { studentId: studentId, status: "enrolled" },
      { status: "dropped" }
    );

    res.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete student" });
  }
});

// ===== BULK OPERATIONS =====
export const bulkDeleteStudents = asyncHandler(async (req, res) => {
  try {
    const { studentIds } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No students selected" });
    }

    // Soft delete - update status to inactive
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { status: "inactive" }
    );

    // Update enrollments to dropped
    await Enrollment.updateMany(
      { studentId: { $in: studentIds }, status: "enrolled" },
      { status: "dropped" }
    );

    res.json({
      success: true,
      message: `${studentIds.length} student(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error bulk deleting students:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete students" });
  }
});

export const bulkUpdateStatus = asyncHandler(async (req, res) => {
  try {
    const { studentIds, status } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No students selected" });
    }

    if (!["active", "inactive"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    await Student.updateMany({ _id: { $in: studentIds } }, { status: status });

    // If setting to inactive, also drop enrollments
    if (status === "inactive") {
      await Enrollment.updateMany(
        { studentId: { $in: studentIds }, status: "enrolled" },
        { status: "dropped" }
      );
    }

    res.json({
      success: true,
      message: `${studentIds.length} student(s) status updated to ${status}`,
    });
  } catch (error) {
    console.error("Error bulk updating students:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update students" });
  }
});
