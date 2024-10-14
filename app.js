const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./Config/dbConnection");
const usersRouter = require("./routes/users");
const morgan = require("morgan");
const { swaggerUi, specs } = require('./swagger');

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use("/", usersRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger UI is available on http://localhost:${PORT}/api-docs`);
});



 


 
