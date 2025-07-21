import Student from "../models/student.models.js";
import Course from "../models/course.models.js";
import Enrollment from "../models/enrollment.models.js";
import Attendance from "../models/attendance.models.js";

export const studentsHandler = async (req, res) => {
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
};

export const studentDetailHandler = async (req, res) => {
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
};
