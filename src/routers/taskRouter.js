import express from "express";

import Task from "../models/task.js";
import auth from "../middleware/auth.js";

const taskRouter = new express.Router();

taskRouter.post("/", auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.user._id,
    });

    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc
taskRouter.get("/", auth, async (req, res) => {
  try {
    const match = {};
    const sort = {};

    if (req.query.completed !== undefined) {
      match.completed = req.query.completed === "true";
    }

    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    await req.user.populate({
      path: "myTasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });
    // const tasks = (await Task.find({ userId: req.user._id, ...match }).limit(limit).skip(skip)).sort({createdAt: -1});
    res.send(req.user.myTasks);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

taskRouter.get("/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, userId: req.user._id });

    if (!task) {
      return res.status(404).send({ error: "Task not found!" });
    }

    res.send(task);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

taskRouter.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "description", "completed"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).send({ error: "Task not found!" });
    }

    updates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();

    res.send(task);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

taskRouter.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(403).send("Task not found!");
    }
    res.send({ message: "Task deleted successfully", task });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export default taskRouter;
