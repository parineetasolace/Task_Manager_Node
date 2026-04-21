import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../../src/models/user.js";
import Task from "../../src/models/task.js";

export const userOneId = new mongoose.Types.ObjectId();

export const userOne = {
  _id: userOneId,
  name: "Parineeta",
  email: "parineeta@example.com",
  password: "abcd1234",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

export const userTwoId = new mongoose.Types.ObjectId();

export const userTwo = {
  _id: userTwoId,
  name: "Shruti",
  email: "shruti@example.com",
  password: "abcd1234",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

export const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  title: "Task-1",
  description: "Complete section on testing node.js",
  completed: true,
  userId: userOne._id,
};

export const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  title: "Task-2",
  description: "Start section 17",
  completed: false,
  userId: userOne._id,
};

export const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  title: "Task_1",
  description: "Complete node.js",
  completed: false,
  userId: userTwo._id,
};

export const taskFour = {
  _id: new mongoose.Types.ObjectId(),
  title: "Task_2",
  description: "Go Home",
  completed: false,
  userId: userTwo._id,
};

export const configureDB = async () => {
  await User.deleteMany();
  await Task.deleteMany();

  await new User(userOne).save();
  await new User(userTwo).save();

  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
  await new Task(taskFour).save();
};
