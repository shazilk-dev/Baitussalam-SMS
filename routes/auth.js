const express = require("express");
const router = express.Router();
const {loginPageHandler, loginPostHandler, dashboardHandler, forgetPasswordHandler, forgetPasswordPostHandler, resetPasswordHandler, logoutHandler} = require("../controllers/authController");
const { requireAuth, requireGuest, requireRole } = require("../middleware/auth");




router.get("/",requireAuth, (req, res) => {
  res.render("pages/index", { title: "Home" });
})

router.get("/login", requireGuest, loginPageHandler);
router.post("/login", requireGuest, loginPostHandler);

router.get("/logout", logoutHandler);

router.get("/dashboard", requireAuth, dashboardHandler);

router.get('/forgot-password', requireGuest, forgetPasswordHandler);
router.post('/forgot-password', requireGuest, forgetPasswordPostHandler);

router.get('/reset-password', requireGuest, resetPasswordHandler)

module.exports = router;
