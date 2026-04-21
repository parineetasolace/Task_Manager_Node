import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

import User from "../models/user.js";

// dotenv.config();

const jwt_key = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log("Token: ", token);

    const decoder = jwt.verify(token, jwt_key);
    const user = await User.findById({
      _id: decoder._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: e.message });
  }
};

export default auth;
