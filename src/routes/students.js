import express from "express";
import {
  studentsHandler,
  studentDetailHandler,
  addStudentPage,
  createStudent,
  editStudentPage,
  updateStudent,
  deleteStudent,
  bulkDeleteStudents,
  bulkUpdateStatus,
} from "../controllers/student.controller.js";
import { verifyJWT, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

// GET routes
router.get("/", requireRole(["admin", "teacher"]), studentsHandler);
router.get("/add", requireRole(["admin", "teacher"]), addStudentPage);
router.get("/:id", requireRole(["admin", "teacher"]), studentDetailHandler);
router.get("/:id/edit", requireRole(["admin", "teacher"]), editStudentPage);

// POST routes
router.post("/", requireRole(["admin", "teacher"]), createStudent);
router.post("/:id/edit", requireRole(["admin", "teacher"]), updateStudent);

// DELETE routes
router.delete("/:id", requireRole(["admin"]), deleteStudent);

// BULK operations
router.post("/bulk/delete", requireRole(["admin"]), bulkDeleteStudents);
router.post("/bulk/status", requireRole(["admin"]), bulkUpdateStatus);

export default router;
