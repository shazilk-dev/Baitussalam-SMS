import express from "express";
import {
  loginPage,
  registerPage,
  forgotPasswordPage,
  resetPasswordPage,
  loginUser,
  registerUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { verifyJWT, requireGuest } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/login", requireGuest, loginPage);
router.post("/login", requireGuest, loginUser);

router.get("/register", requireGuest, registerPage);
router.post("/register", requireGuest, registerUser);

// Debug endpoint to check user existence (remove in production)
router.get("/debug-user/:email", async (req, res) => {
  try {
    const { User } = await import("../models/user.models.js");
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    res.json({
      exists: !!user,
      status: user ? user.status : null,
      role: user ? user.role : null,
      id: user ? user._id.toString().substring(0, 8) + "***" : null,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

router.get("/forgot-password", requireGuest, forgotPasswordPage);
router.post("/forgot-password", requireGuest, forgotPasswordPage); // TODO: implement POST handler
router.get("/reset-password", requireGuest, resetPasswordPage);

router.get("/logout", verifyJWT, logoutUser);

export default router;
