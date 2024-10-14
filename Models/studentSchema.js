const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  attendance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendance",
    },
  ],
});

// Virtual for auto-populating attendance
studentSchema.virtual("attendanceRecords", {
  ref: "Attendance",
  localField: "_id",
  foreignField: "studentName",
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
