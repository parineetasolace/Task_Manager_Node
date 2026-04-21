import express from "express";

import userRouter from "./routers/userRouter.js";
import taskRouter from "./routers/taskRouter.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Task Manager");
});

app.use("/users", userRouter);
app.use("/tasks", taskRouter);

export default app;
