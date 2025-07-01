const express = require("express");
const router = express.Router();
const { studentsHandler, studentDetailHandler } = require("../controllers/studentController");


router.get("/", studentsHandler)
router.get("/:id", studentDetailHandler)


module.exports = router;