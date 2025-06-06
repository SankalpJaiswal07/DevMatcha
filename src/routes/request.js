const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/Auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("Sending connection request");
    res.send(user.firstName + " sent the Connection request!");
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = requestRouter;
