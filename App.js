const express = require("express");
const { default: mongoose } = require("mongoose");
const Customer = require("./Customer");
const Questions = require("./Questions");
// locallhost:3000/Signin
const app = express();
var url = "mongodb://localhost:27017/test";
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database is Connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.use("/test", (req, res) => {
  res.end("Server is RUninng");
});

app.use("/User", Customer);
app.use("/Admin", Questions);
app.use("/", (req, res) => {
  res.end("Server is RUninng");
});

module.exports = app;
