const express = require("express");
const router = express.Router();


router.get("/", (req, res) => {
  res.render("pages/index", { title: "Home" });
})

router.get("/login", (req, res) => {
  res.render("pages/login", { title: "Login" });
});

router.get("/dashboard", (req, res) => {
  res.render("pages/dashboard", { title: "Dashboard", user: "Shazil " });
});

module.exports = router;
