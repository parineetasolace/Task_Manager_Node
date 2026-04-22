import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import userRouter from "./routers/userRouter.js";
import taskRouter from "./routers/taskRouter.js";

const app = express();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, "../public");
console.log(publicDir);

app.use(express.static(publicDir));

app.use("/users", userRouter);
app.use("/tasks", taskRouter);

export default app;
