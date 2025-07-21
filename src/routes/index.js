import express from "express";
import { dashboardHandler } from "../controllers/dashboard.controller.js";
import { logoutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    if (token) {
      res.redirect("/dashboard");
    } else {
      res.redirect("/auth/login");
    }
  } catch (error) {
    console.error("Error in root route:", error);
    res.redirect("/auth/login");
  }
});

router.get("/dashboard", verifyJWT, dashboardHandler);

router.get("/logout", verifyJWT, logoutUser);

router.get("/clear-cookies", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.redirect("/auth/login?success=cookies_cleared");
});

export default router;
