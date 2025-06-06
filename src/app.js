const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/database");
const port = process.env.PORT;
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  // creating a new instance of user model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
  }
});

//Feed API-GET/feed -get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("users not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

//Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.userEmail;
  try {
    const user = await User.findOne({ emailId: userEmail });
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

//Delete user by Id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

//Update user by Id
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    // console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Update failed:" + err.message);
  }
});

//update user by email
// app.patch("/user", async (req, res) => {
//   const userEmail = req.body.userEmail;
//   console.log(userEmail);
//   const data = req.body;

//   try {
//     const user = await User.findOneAndUpdate({ emailId: userEmail }, data);
//     console.log(user);
//     res.send("User updated successfully");
//   } catch (err) {
//     res.status(400).send("Something went wrong!");
//   }
// });

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
