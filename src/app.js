const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("sankalp jaiswal");
});
app.use("/test", (req, res) => {
  res.send("Hello from test");
});
app.use("/hello", (req, res) => {
  res.send("Hello");
});

app.listen(7777, () => {
  console.log("server running on port 7777...");
});
