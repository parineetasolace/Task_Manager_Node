import express from "express";
import multer from "multer";
import sharp from "sharp";

import User from "../models/user.js";
import auth from "../middleware/auth.js";
import {
  sendAccountDeletionEmail,
  sendWelcomeEmail,
} from "../services/emailService.js";

const userRouter = new express.Router();

userRouter.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    const token = await user.generateAuthToken();

    await sendWelcomeEmail(user);

    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password,
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

userRouter.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

userRouter.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.send({ message: "Logout Successful!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

userRouter.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send({ message: "Logged out of all sessions" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

userRouter.patch("/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: "Invalid Updates" });
  }

  try {
    const user = await User.findById({ _id: req.user._id });

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();

    res.send(user);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

userRouter.delete("/me", auth, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userName = req.user.name;

    await req.user.deleteOne({ _id: req.user._id });

    setImmediate(async () => {
      try {
        await sendAccountDeletionEmail({ name: userName, email: userEmail });
      } catch (err) {
        console.log("Delete email failed:", err.message);
      }
    });

    res.send({ message: "User deleted successfully", user: req.user });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
      return cb(new Error("File must be an image!"));
    }
    cb(undefined, true);
  },
});

userRouter.post(
  "/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();

    console.log("Uploaded File: ", req.user.avatar);
    res.send("File Uploaded!");
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  },
);

userRouter.delete("/me/avatar", auth, async (req, res) => {
  try {
    if (!req.user.avatar) {
      return res.status(400).send({ error: "No avatar exists!" });
    }

    req.user.avatar = undefined;
    req.user.avatarType = undefined;
    await req.user.save();
    res.send({ message: "Avatar Deleted Successfully!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

userRouter.get("/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new Error("User not found!");
    } else if (!user.avatar) {
      throw new Error("No Avatar set!");
    }

    console.log("Is buffer:", Buffer.isBuffer(user.avatar));
    console.log("Size:", user.avatar.length);

    console.log(user.avatar);

    const img = Buffer.isBuffer(user.avatar)
      ? user.avatar
      : Buffer.from(user.avatar.buffer);

    res.set("Content-Type", "image/png");

    console.log("img: ", img);
    console.log("img.length", img.length);

    return res.end(img);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(404).send({ error: err.message });
  }
});

export default userRouter;
