import express from "express";
import {
  studentsHandler,
  studentDetailHandler,
} from "../controllers/student.controller.js";
import { verifyJWT, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", requireRole(["admin", "teacher"]), studentsHandler);

router.get("/:id", requireRole(["admin", "teacher"]), studentDetailHandler);

export default router;
