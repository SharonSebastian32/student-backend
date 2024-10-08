const Attendance = require("../models/attendance");
const Student = require("../models/student");

// Mark or edit attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, attendanceStatus } = req.body;

    let attendance = await Attendance.findOne({ student: studentId, date });

    if (attendance) {
      attendance.attendanceStatus = attendanceStatus;
    } else {
      attendance = new Attendance({
        student: studentId,
        date,
        attendanceStatus,
      });
    }

    await attendance.save();
    res
      .status(200)
      .json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: "Error marking attendance", error });
  }
};

// View attendance report of a student
exports.getAttendanceReport = async (req, res) => {
  try {
    const { studentId } = req.params;
    const attendanceRecords = await Attendance.find({ student: studentId });

    // Calculate attendance
    let totalPresent = 0,
      totalHalfDay = 0,
      totalAbsent = 0;

    attendanceRecords.forEach((record) => {
      if (record.attendanceStatus === "present") totalPresent += 1;
      if (record.attendanceStatus === "half-day") totalHalfDay += 1;
      if (record.attendanceStatus === "absent") totalAbsent += 1;
    });

    const halfDaysCountedAsFull = Math.floor(totalHalfDay / 2);
    totalAbsent += totalHalfDay % 2; // if odd half-days, count one more as absent

    const fullPresentDays = totalPresent + halfDaysCountedAsFull;

    res.status(200).json({
      totalDays: attendanceRecords.length,
      present: fullPresentDays,
      absent: totalAbsent,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching attendance report", error });
  }
};
