const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  studentName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  attendanceType: {
    type: String,
    enum: ["FullDay Present", "Half Day Present", "Absent", "Not Marked"],
    default: "Not Marked",
    required: true,
  },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
