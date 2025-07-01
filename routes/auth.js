const express = require("express");
const router = express.Router();
const { showLoginPage } = require("../controllers/authController");




router.get("/", (req, res) => {
  res.render("pages/index", { title: "Home" });
})

router.get("/login", showLoginPage);


router.get("/dashboard", (req, res) => {
  res.render("pages/dashboard", { title: "Dashboard", user: "Shazil " });
});

module.exports = router;
