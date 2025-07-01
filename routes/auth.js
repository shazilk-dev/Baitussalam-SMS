const express = require("express");
const router = express.Router();
const {loginPageHandler, dashboardHandler, forgetPasswordHandler, resetPasswordHandler} = require("../controllers/authController");




router.get("/", (req, res) => {
  res.render("pages/index", { title: "Home" });
})

router.get("/login", loginPageHandler);

router.get("/dashboard", dashboardHandler);

router.get('/forget-password', forgetPasswordHandler);

router.get('/reset-password', resetPasswordHandler)

module.exports = router;
