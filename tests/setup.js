import dotenv from "dotenv";
dotenv.config({ path: "test.env" });

import mongoose from "mongoose";
import connectDB from "../src/db/mongoose";

beforeAll(async () => {
  try {
    await connectDB();
    console.log("Connected to DB");
  } catch (err) {
    console.log("DB connection failed: ", err.message);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
