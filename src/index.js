import dotenv from "dotenv";

import connectDB from "./db/mongoose.js";

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: "test.env" });
} else {
  dotenv.config();
}

import app from "./app.js";

const port = process.env.PORT;

connectDB();

app.listen(port, () => {
  console.log(`Server is listeing on port ${port}`);
});
