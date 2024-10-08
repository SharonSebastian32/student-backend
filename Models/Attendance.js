const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  date: { type: Date, required: true },
  attendanceStatus: {
    type: String,
    enum: ["present", "half-day", "absent"],
    required: true,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
