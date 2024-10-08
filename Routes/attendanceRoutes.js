const express = require("express");
const attendanceController = require("../controllers/attendanceController");
const router = express.Router();

router.post("/mark", attendanceController.markAttendance);
router.get("/report/:studentId", attendanceController.getAttendanceReport);

module.exports = router;
