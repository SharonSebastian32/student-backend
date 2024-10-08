const Student = require("../Models/Students");

// Add a student
exports.addStudent = async (req, res) => {
  try {
    const { name, rollNumber } = req.body;
    const student = new Student({ name, rollNumber });
    await student.save();
    res.status(201).json({ message: "Student added successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Error adding student", error });
  }
};
