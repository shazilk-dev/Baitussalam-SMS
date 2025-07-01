const express = require("express");
const router = express.Router();
const { studentsHandler, studentDetailHandler } = require("../controllers/studentController");


router.get("/students", studentsHandler)


router.get("students/:id", studentDetailHandler)


module.exports = router;