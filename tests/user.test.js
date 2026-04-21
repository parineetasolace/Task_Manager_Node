import request from "supertest";

import app from "../src/app.js";
import User from "../src/models/user.js";
import nodemailer, { __mockSendMail } from "nodemailer";
import { userOneId, userOne, configureDB } from "./fixtures/db.js";

jest.mock("nodemailer");

beforeEach(async () => {
  await configureDB();
  __mockSendMail.mockClear();
});

test("Should signup a new user", async () => {
  const response = await request(app).post("/users").send({
    name: "Parineeta",
    email: "parineetapareek215@gmail.com",
    password: "abcd1234",
  });

  console.log("Response Status: ", response.status);
  console.log("Response Body: ", response.body);
  expect(response.status).toBe(201);
});

test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login non-existent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "wrongpassword",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", userOne.tokens[0].token)
    .send({ name: "ABCD" })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe("ABCD");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", userOne.tokens[0].token)
    .send({ location: "Sinnar" })
    .expect(400);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("sends email", async () => {
  const transporter = nodemailer.createTransport();

  await transporter.sendMail({
    to: "user@test.com",
    subject: "Hello",
    text: "Hi",
  });

  expect(__mockSendMail).toHaveBeenCalled();
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/avatar.png")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});
