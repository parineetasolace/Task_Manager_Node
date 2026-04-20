import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionURL = process.env.MONGO;

async function connectDB() {
  try {
    await mongoose.connect(connectionURL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB: ", err.message);
  }
}

export default connectDB;
