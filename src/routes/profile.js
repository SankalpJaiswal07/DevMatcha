const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/Auth");
const {
  validateEditProfileData,
  validatePassword,
} = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    const { password, ...safeUser } = loggedInUser.toObject();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: safeUser,
    });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const keys = Object.keys(req.body);

    if (keys.length !== 1 || keys[0] !== "password") {
      throw new Error("Invalid request");
    }

    const updatedPassword = req.body[keys[0]];
    const loggedInUser = req.user;
    const passwordHash = await bcrypt.hash(updatedPassword, 10);

    loggedInUser.password = passwordHash;
    await loggedInUser.save();
    const { password, ...safeUser } = loggedInUser.toObject();
    res.json({
      message: `${loggedInUser.firstName}, your password updated successfully`,
      data: safeUser,
    });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = profileRouter;
