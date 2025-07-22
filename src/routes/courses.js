import express from "express";
import { verifyJWT, requireRole } from "../middleware/auth.middleware.js";
import {
  coursesHandler,
  getCourseDetails,
  renderAddCourseForm,
  addCourse,
  renderEditCourseForm,
  updateCourse,
  deleteCourse,
  bulkDeleteCourses,
  activateDeactivateCourse,
} from "../controllers/course.controller.js";

const router = express.Router();

router.use(verifyJWT);

// ===== COURSE MANAGEMENT ROUTES =====
router.get("/", requireRole(["admin", "teacher", "staff"]), coursesHandler);
router.get("/add", requireRole(["admin", "staff"]), renderAddCourseForm);
router.post("/add", requireRole(["admin", "staff"]), addCourse);
router.get(
  "/:id",
  requireRole(["admin", "teacher", "staff"]),
  getCourseDetails
);
router.get("/:id/edit", requireRole(["admin", "staff"]), renderEditCourseForm);
router.post("/:id/edit", requireRole(["admin", "staff"]), updateCourse);
router.post("/:id/delete", requireRole(["admin"]), deleteCourse);
router.post("/bulk-delete", requireRole(["admin"]), bulkDeleteCourses);
router.post(
  "/:id/toggle-status",
  requireRole(["admin", "staff"]),
  activateDeactivateCourse
);

export default router;
