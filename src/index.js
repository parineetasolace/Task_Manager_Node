import express from "express";
import dotenv from "dotenv";

import connectDB from "./db/mongoose.js";
import userRouter from "./routers/userRouter.js";
import taskRouter from "./routers/taskRouter.js";
import sendEmail from "./utils/sendEmail.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Task Manager 🚀");
});

app.use("/users", userRouter);
app.use("/tasks", taskRouter);

app.listen(port, () => {
  console.log(`Server is listeing on port ${port}`);
});
