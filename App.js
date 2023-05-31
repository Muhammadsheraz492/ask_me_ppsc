const express = require("express");
const { default: mongoose } = require("mongoose");
const Customer = require("./Customer");
const Questions = require("./Questions");
const bodyParser = require("body-parser");
// locallhost:3000/Signin
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
mongoose
  .connect(process.env.DB, {
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
// app.use("/", (req, res) => {
//   res.end("Home is RUninng");
// });

module.exports = app;
