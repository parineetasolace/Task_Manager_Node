import request from "supertest";

import Task from "../src/models/task.js";
import app from "../src/app.js";
import { userOneId, userOne, configureDB, userTwo, taskOne, taskThree } from "./fixtures/db.js";

beforeEach(configureDB);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      title: "Task 1",
      description: "Start section 17",
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
});

test("Should fetch user tasks", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});

test("Should not delete unauthorized tasks", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskThree._id}`)
    .set("Authorization", `Bearer ${userOneId}`)
    .send()
    .expect(401);
});
