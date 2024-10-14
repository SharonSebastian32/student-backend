const express = require("express");
const router = express.Router();
const Student = require("../models/studentSchema"); // Adjust the path based on your project structure
const Attendance = require("../models/attendance");
const calculateAttendanceSummary = (attendanceRecords) => {
  const totalLeave =
    attendanceRecords.filter((record) => record.attendanceType === "Absent")
      .length +
    attendanceRecords.filter(
      (record) => record.attendanceType === "Half Day Present"
    ).length /
      2;

  const totalPresent = attendanceRecords.filter(
    (record) => record.attendanceType === "FullDay Present"
  ).length;

  return { totalLeave, totalPresent };
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - studentName
 *         - rollNumber
 *       properties:
 *         studentName:
 *           type: string
 *           description: The name of the student
 *         rollNumber:
 *           type: number
 *           description: The roll number of the student
 *     Attendance:
 *       type: object
 *       required:
 *         - date
 *         - studentName
 *         - attendanceType
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: The date of attendance
 *         studentName:
 *           type: string
 *           description: The ID of the student
 *         attendanceType:
 *           type: string
 *           description: The type of attendance (e.g., FullDay Present, Half Day Present, Absent)
 */

/**
 * @swagger
 * /api/add-student:
 *   post:
 *     summary: Register a new student
 *     tags: [Student]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Student registered successfully!
 *       500:
 *         description: Error while registering the student
 */
router.post("/add-student", async (req, res) => {
  const { studentName, rollNumber } = req.body;

  try {
    const newStudent = new Student({
      studentName,
      rollNumber,
    });

    await newStudent.save();

    res.status(201).json({ message: "Student registered successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Already registered  a user with this roll number" });
  }
});

/**
 * @swagger
 * /api/add-attendance:
 *   post:
 *     summary: Add attendance for a student
 *     tags: [Attendance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Attendance'
 *     responses:
 *       201:
 *         description: Attendance marked successfully
 *       404:
 *         description: Student not found
 *       500:
 *         description: Failed to add attendance
 */
router.post("/add-attendance", async (req, res) => {
  const { date, studentName, attendanceType } = req.body;

  try {
    const student = await Student.findById(studentName);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const existingAttendance = await Attendance.findOne({
      studentName,
      date: new Date(date),
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance for this student on this date already exists",
      });
    }

    const newAttendance = new Attendance({
      date,
      studentName,
      attendanceType,
    });

    const savedAttendance = await newAttendance.save();

    const updatedStudent = await Student.findByIdAndUpdate(
      studentName,
      { $push: { attendance: savedAttendance._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Attendance marked  successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add attendance" });
  }
});

/**
 * @swagger
 * /api/student-attendance-summary:
 *   get:
 *     summary: Get the attendance summary of students within a date range
 *     tags: [Attendance]
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date for attendance summary
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date for attendance summary
 *     responses:
 *       200:
 *         description: Attendance summary fetched successfully
 *       400:
 *         description: Invalid date range
 *       500:
 *         description: Error while fetching summary
 */
router.get("/student-attendance-summary", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Please provide both startDate and endDate" });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  try {
    const students = await Student.find()
      .populate({
        path: "attendanceRecords",
        match: { date: { $gte: start, $lte: end } },
      })
      .select("rollNumber studentName attendanceRecords");

    const summary = students.map((student) => {
      const { totalLeave, totalPresent } = calculateAttendanceSummary(
        student.attendanceRecords
      );
      return {
        rollNumber: student.rollNumber,
        studentName: student.studentName,
        totalLeave,
        totalPresent,
      };
    });

    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch student attendance summary", error });
  }
});

module.exports = router;
