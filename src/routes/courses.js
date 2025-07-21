import express from "express";

import { verifyJWT, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/", requireRole(["admin", "teacher", "staff"]), (req, res) => {
  res.status(501).render("pages/error", {
    title: "Feature Coming Soon",
    statusCode: 501,
    error: "Not Implemented",
    message: "Course management feature is coming soon!",
  });
});

export default router;
