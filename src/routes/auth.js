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

router.get("/forgot-password", requireGuest, forgotPasswordPage);
router.post("/forgot-password", requireGuest, forgotPasswordPage); // TODO: implement POST handler
router.get("/reset-password", requireGuest, resetPasswordPage);

router.get("/logout", verifyJWT, logoutUser);

export default router;
