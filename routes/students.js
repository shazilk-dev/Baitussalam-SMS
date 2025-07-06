const express = require("express");
const router = express.Router();
const { studentsHandler, studentDetailHandler } = require("../controllers/studentController");
const { requireAuth, requirePermission } = require("../middleware/auth");


router.get("/", requireAuth,  studentsHandler)
router.get("/:id", requireAuth, studentDetailHandler)


module.exports = router;