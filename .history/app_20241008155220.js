const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const studentRoutes = require("./Routes/StudentRoutes");
const attendanceRoutes = require("./Routes/attendanceRoutes");

const app = express();

 app.use(bodyParser.json());

 app.set("view engine", "ejs");

 app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/students", studentRoutes);
app.use("/attendance", attendanceRoutes);

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/attendance", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
