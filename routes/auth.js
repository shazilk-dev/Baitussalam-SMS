const express = require("express");
const router = express.Router();
const {loginPageHandler, loginPostHandler, dashboardHandler, forgetPasswordHandler, forgetPasswordPostHandler, resetPasswordHandler} = require("../controllers/authController");




router.get("/", (req, res) => {
  res.render("pages/index", { title: "Home" });
})

router.get("/login", loginPageHandler);
router.post("/login", loginPostHandler);

router.get("/dashboard", dashboardHandler);

router.get('/forgot-password', forgetPasswordHandler);
router.post('/forgot-password', forgetPasswordPostHandler);

router.get('/reset-password', resetPasswordHandler)

module.exports = router;
