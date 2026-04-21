import mongoose from "mongoose";

async function connectDB() {
  const connectionURL = process.env.MONGO;
  
  try {
    await mongoose.connect(connectionURL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB: ", err.message);
  }
}

export default connectDB;
