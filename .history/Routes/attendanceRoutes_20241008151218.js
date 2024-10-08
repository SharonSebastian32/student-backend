const express = require("express");
const studentController = require("../controllers/studentController");
const router = express.Router();

router.post("/add", studentController.addStudent);

module.exports = router;
