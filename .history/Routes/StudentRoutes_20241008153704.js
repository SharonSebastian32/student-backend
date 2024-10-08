const express = require("express");
const studentController = require("../controllers/studentController");
const router = express.Router();

router.post("/add", studentController.addStudent);
router.get("/list", studentController.listStudents);

module.exports = router;
