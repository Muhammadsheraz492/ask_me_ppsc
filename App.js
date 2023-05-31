const express = require("express");
const app = express();
app.use("/", (req, res) => {
  res.end("Okey Everting is perfect ");
});
module.exports = app;
