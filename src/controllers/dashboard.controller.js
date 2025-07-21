import Student from "../models/student.models.js";
import Course from "../models/course.models.js";
import Attendance from "../models/attendance.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const calculateStats = async () => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: "active" });
    const totalCourses = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ status: "active" });
    const completedCourses = await Course.countDocuments({
      status: "completed",
    });

    const totalAttendanceRecords = await Attendance.countDocuments();
    const presentRecords = await Attendance.countDocuments({
      status: "present",
    });
    const averageAttendance =
      totalAttendanceRecords > 0
        ? Math.round((presentRecords / totalAttendanceRecords) * 100)
        : 0;

    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newStudentsThisMonth = await Student.countDocuments({
      enrollmentDate: { $gte: thisMonth },
    });

    return {
      totalStudents,
      activeStudents,
      activeCourses,
      completedCourses,
      averageAttendance,
      studentGrowth:
        newStudentsThisMonth > 0 ? `+${newStudentsThisMonth}` : "0",
      courseGrowth: activeCourses > 2 ? "+2" : "0",
    };
  } catch (error) {
    console.error("Error calculating stats:", error);

    return {
      totalStudents: 0,
      activeStudents: 0,
      activeCourses: 0,
      completedCourses: 0,
      averageAttendance: 0,
      studentGrowth: "0",
      courseGrowth: "0",
    };
  }
};

const getCurrentDate = () => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const dashboardHandler = asyncHandler(async (req, res) => {
  try {
    const stats = await calculateStats();

    const activeCourses = await Course.find({ status: "active" })
      .select("title description instructor duration status startDate endDate")
      .limit(5);

    const coursesWithDefaults = activeCourses.map((course) => {
      const startDate = new Date(course.startDate);
      const endDate = new Date(course.endDate);
      const currentDate = new Date();

      const totalWeeks =
        Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 7)) || 12;

      const weeksPassed = Math.ceil(
        (currentDate - startDate) / (1000 * 60 * 60 * 24 * 7)
      );
      const currentWeek = Math.max(1, Math.min(weeksPassed, totalWeeks));

      return {
        ...course.toObject(),
        status: course.status || "active",
        currentWeek: currentWeek,
        totalWeeks: totalWeeks,
      };
    });

    const recentStudents = await Student.find({ status: "active" })
      .select("fullName email enrollmentDate")
      .sort({ enrollmentDate: -1 })
      .limit(5);

    res.render("pages/dashboard", {
      title: "Dashboard",
      user: req.user,
      currentPage: "dashboard",
      pageCSS: "dashboard",
      pageJS: "dashboard",
      stats,
      activeCourses: coursesWithDefaults,
      recentStudents,
      currentDate: getCurrentDate(),
    });
  } catch (error) {
    console.error("Error rendering dashboard:", error);
    res.status(500).render("pages/error", {
      title: "Error",
      statusCode: 500,
      error: "Internal Server Error",
      message: "Could not load dashboard",
    });
  }
});

export { calculateStats };
