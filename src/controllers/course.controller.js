import Course from "../models/course.models.js";
import Student from "../models/student.models.js";
import Enrollment from "../models/enrollment.models.js";
import Attendance from "../models/attendance.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

// ===== MAIN COURSES LISTING =====
export const coursesHandler = asyncHandler(async (req, res) => {
  try {
    const courses = await Course.find().sort({ startDate: -1 });

    const coursesWithDetails = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await Enrollment.countDocuments({
          courseId: course._id,
          status: "enrolled",
        });

        const totalAttendanceRecords = await Attendance.countDocuments({
          courseId: course._id,
        });

        const presentRecords = await Attendance.countDocuments({
          courseId: course._id,
          status: "present",
        });

        const averageAttendance =
          totalAttendanceRecords > 0
            ? Math.round((presentRecords / totalAttendanceRecords) * 100)
            : 0;

        return {
          ...course.toObject(),
          id: course._id,
          enrollmentCount,
          averageAttendance,
          formattedStartDate: new Date(course.startDate).toLocaleDateString(),
          formattedEndDate: new Date(course.endDate).toLocaleDateString(),
        };
      })
    );

    const stats = {
      totalCourses: courses.length,
      activeCourses: courses.filter((c) => c.status === "active").length,
      upcomingCourses: courses.filter((c) => c.status === "upcoming").length,
      completedCourses: courses.filter((c) => c.status === "completed").length,
    };

    res.render("pages/courses", {
      title: "Course Management",
      user: req.user,
      courses: coursesWithDetails,
      stats,
      currentPage: "courses",
      pageCSS: "courses",
      pageJS: "courses",
      success: req.query.success,
      error: req.query.error,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).render("pages/error", {
      title: "Error",
      statusCode: 500,
      error: "Internal Server Error",
      message: "Could not fetch courses",
    });
  }
});

// ===== COURSE DETAILS =====
export const getCourseDetails = asyncHandler(async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).render("pages/404");
    }

    // Get enrolled students with their details
    const enrollments = await Enrollment.find({
      courseId: course._id,
      status: "enrolled",
    }).populate("studentId");

    const enrolledStudents = enrollments.map((enrollment) => ({
      ...enrollment.studentId.toObject(),
      id: enrollment.studentId._id,
      name: enrollment.studentId.fullName,
      enrollmentDate: enrollment.enrollmentDate,
    }));

    // Get course attendance statistics
    const totalAttendanceRecords = await Attendance.countDocuments({
      courseId: course._id,
    });

    const presentRecords = await Attendance.countDocuments({
      courseId: course._id,
      status: "present",
    });

    const averageAttendance =
      totalAttendanceRecords > 0
        ? Math.round((presentRecords / totalAttendanceRecords) * 100)
        : 0;

    // Calculate course progress
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);
    const currentDate = new Date();

    const totalDuration = endDate - startDate;
    const elapsed = currentDate - startDate;
    const progressPercentage = Math.max(
      0,
      Math.min(100, Math.round((elapsed / totalDuration) * 100))
    );

    const courseData = {
      ...course.toObject(),
      id: course._id,
      enrollmentCount: enrolledStudents.length,
      averageAttendance,
      progressPercentage,
      formattedStartDate: startDate.toLocaleDateString(),
      formattedEndDate: endDate.toLocaleDateString(),
      enrolledStudents,
    };

    res.render("pages/course-profile", {
      title: "Course Details",
      user: req.user,
      course: courseData,
      currentPage: "courses",
      pageCSS: "course-profile",
      pageJS: "course-profile",
      success: req.query.success,
      error: req.query.error,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);

    if (error.name === "CastError") {
      return res.status(404).render("pages/404");
    }

    res.status(500).render("pages/error", {
      title: "Error",
      statusCode: 500,
      error: "Internal Server Error",
      message: "Could not fetch course details",
    });
  }
});

// ===== ADD NEW COURSE =====
export const renderAddCourseForm = asyncHandler(async (req, res) => {
  try {
    res.render("pages/course-add", {
      title: "Add New Course",
      user: req.user,
      currentPage: "courses",
      pageCSS: ["course-forms"],
      pageJS: ["course-form"],
      success: req.query.success,
      error: req.query.error,
    });
  } catch (error) {
    console.error("Error rendering add course form:", error);
    res.redirect("/courses?error=Could not load add course form");
  }
});

export const addCourse = asyncHandler(async (req, res) => {
  try {
    const { title, code, description, instructor, startDate, endDate, status } =
      req.body;

    // Validate required fields
    if (!title || !code || !instructor || !startDate || !endDate) {
      return res.redirect(
        "/courses/add?error=All required fields must be filled"
      );
    }

    // Check if course code already exists
    const existingCourse = await Course.findOne({ code });
    if (existingCourse) {
      return res.redirect(
        `/courses/add?error=Course code '${code}' already exists`
      );
    }

    // Validate date logic
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return res.redirect(
        "/courses/add?error=End date must be after start date"
      );
    }

    // Create new course
    const newCourse = await Course.create({
      title: title.trim(),
      code: code.toUpperCase().trim(),
      description: description?.trim() || "",
      instructor: instructor.trim(),
      startDate: start,
      endDate: end,
      status: status || "upcoming",
    });

    res.redirect(
      `/courses/${newCourse._id}?success=Course '${newCourse.title}' created successfully`
    );
  } catch (error) {
    console.error("Error creating course:", error);

    if (error.code === 11000) {
      return res.redirect("/courses/add?error=Course code already exists");
    }

    res.redirect(
      "/courses/add?error=Failed to create course. Please try again."
    );
  }
});

// ===== EDIT COURSE =====
export const renderEditCourseForm = asyncHandler(async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).render("pages/404");
    }

    const courseData = {
      ...course.toObject(),
      id: course._id,
      // Format dates for HTML date inputs
      startDate: course.startDate.toISOString().split("T")[0],
      endDate: course.endDate.toISOString().split("T")[0],
    };

    res.render("pages/course-edit", {
      title: "Edit Course",
      user: req.user,
      course: courseData,
      currentPage: "courses",
      pageCSS: ["course-forms"],
      pageJS: ["course-form"],
      success: req.query.success,
      error: req.query.error,
    });
  } catch (error) {
    console.error("Error rendering edit course form:", error);

    if (error.name === "CastError") {
      return res.status(404).render("pages/404");
    }

    res.redirect("/courses?error=Could not load course edit form");
  }
});

export const updateCourse = asyncHandler(async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, code, description, instructor, startDate, endDate, status } =
      req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.redirect("/courses?error=Course not found");
    }

    // Validate required fields
    if (!title || !code || !instructor || !startDate || !endDate) {
      return res.redirect(
        `/courses/${courseId}/edit?error=All required fields must be filled`
      );
    }

    // Check if course code already exists (excluding current course)
    const existingCourse = await Course.findOne({
      code: code.toUpperCase().trim(),
      _id: { $ne: courseId },
    });

    if (existingCourse) {
      return res.redirect(
        `/courses/${courseId}/edit?error=Course code '${code}' already exists`
      );
    }

    // Validate date logic
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return res.redirect(
        `/courses/${courseId}/edit?error=End date must be after start date`
      );
    }

    // Update course
    await Course.findByIdAndUpdate(courseId, {
      title: title.trim(),
      code: code.toUpperCase().trim(),
      description: description?.trim() || "",
      instructor: instructor.trim(),
      startDate: start,
      endDate: end,
      status: status || course.status,
    });

    res.redirect(`/courses/${courseId}?success=Course updated successfully`);
  } catch (error) {
    console.error("Error updating course:", error);
    res.redirect(
      `/courses/${req.params.id}/edit?error=Failed to update course`
    );
  }
});

// ===== DELETE COURSE =====
export const deleteCourse = asyncHandler(async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.redirect("/courses?error=Course not found");
    }

    // Check if course has enrolled students
    const enrollmentCount = await Enrollment.countDocuments({
      courseId: courseId,
      status: "enrolled",
    });

    if (enrollmentCount > 0) {
      return res.redirect(
        `/courses/${courseId}?error=Cannot delete course with enrolled students. Please transfer or unenroll students first.`
      );
    }

    // Delete related enrollments and attendance records
    await Enrollment.deleteMany({ courseId: courseId });
    await Attendance.deleteMany({ courseId: courseId });

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    res.redirect(
      `/courses?success=Course '${course.title}' deleted successfully`
    );
  } catch (error) {
    console.error("Error deleting course:", error);
    res.redirect(`/courses/${req.params.id}?error=Failed to delete course`);
  }
});

// ===== BULK DELETE COURSES =====
export const bulkDeleteCourses = asyncHandler(async (req, res) => {
  try {
    const { courseIds } = req.body;

    if (!courseIds || courseIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No courses selected for deletion",
      });
    }

    // Check for courses with enrolled students
    const coursesWithStudents = await Enrollment.aggregate([
      {
        $match: {
          courseId: { $in: courseIds.map((id) => id) },
          status: "enrolled",
        },
      },
      {
        $group: {
          _id: "$courseId",
          count: { $sum: 1 },
        },
      },
    ]);

    if (coursesWithStudents.length > 0) {
      const courses = await Course.find({
        _id: { $in: coursesWithStudents.map((c) => c._id) },
      }).select("title");

      const courseNames = courses.map((c) => c.title).join(", ");

      return res.status(400).json({
        success: false,
        message: `Cannot delete courses with enrolled students: ${courseNames}`,
      });
    }

    // Delete related data and courses
    await Enrollment.deleteMany({ courseId: { $in: courseIds } });
    await Attendance.deleteMany({ courseId: { $in: courseIds } });
    const result = await Course.deleteMany({ _id: { $in: courseIds } });

    res.json({
      success: true,
      message: `${result.deletedCount} course(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error in bulk delete:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete courses",
    });
  }
});

// ===== TOGGLE COURSE STATUS =====
export const activateDeactivateCourse = asyncHandler(async (req, res) => {
  try {
    const courseId = req.params.id;
    const { newStatus } = req.body;

    if (!["active", "upcoming", "completed"].includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      { status: newStatus },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      message: `Course status updated to ${newStatus}`,
      status: newStatus,
    });
  } catch (error) {
    console.error("Error updating course status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update course status",
    });
  }
});
