const Student = require("../Models/Students");

exports.listStudents = async (req, res) => {
  try {
    // Fetch all students from the database
    const students = await Student.find();

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};

// Function to add a student (already exists but including for reference)
exports.addStudent = async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res
      .status(201)
      .json({ message: "Student added successfully", student: newStudent });
  } catch (error) {
    res.status(400).json({ message: "Error adding student", error });
  }
};
