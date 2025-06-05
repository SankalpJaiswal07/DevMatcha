const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/database");
const port = process.env.PORT;
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Dhruv",
    lastName: "Patil",
    emailId: "dhruv@gmail.com",
    password: "Dhruv@123",
  };

  const user = new User(userObj);
  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(port, () => {
      console.log(`server running on port ${port} ...`);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
