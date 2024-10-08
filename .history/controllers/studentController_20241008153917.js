// Import your Student model (assuming you're using Mongoose for MongoDB)
const Student = require("");

// Function to get all students
exports.listStudents = async (req, res) => {
  try {
    // Fetch all students from the database
    const students = await Student.find();

    // Return the list of students in JSON format
    res.status(200).json(students);
  } catch (error) {
    // If an error occurs, send the error message
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
