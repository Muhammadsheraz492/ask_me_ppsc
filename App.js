// const express = require("express");
// const { default: mongoose } = require("mongoose");
// const Customer = require("./Customer");
// const Questions = require("./Questions");
// const bodyParser = require("body-parser");
// // locallhost:3000/Signin
// require("dotenv").config();
// const app = express();
// const core = require("cors");
// const morgan = require("morgan");
// app.use(core());
// app.use(morgan("dev"));
// app.use(bodyParser.json());
// mongoose
//   .connect(process.env.DB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Database is Connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// app.use("/test", (req, res) => {
//   res.end("Server is RUninng");
// });

// app.use("/User", Customer);
// app.use("/Admin", Questions);
// // app.use("/", (req, res) => {
// //   res.end("Home is RUninng");
// // });

// module.exports = app;
const express = require("express");
const Admin = require("./Questions");
const User = require("./Customer");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const morgan = require("morgan");
const core = require("cors");
const Paper = require("./modal/Paper");
const app = express();
app.use(bodyParser.json());
app.use(core());

app.use(express.json({ extended: false }));
app.use(morgan("dev"));
app.use("/Admin", Admin);
app.use("/User", User);
app.use("/Upload",express.static('uploads'))
app.use("/CheckDataBase", (req, res) => {
  mongoose
    .connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      res.status(200).json("Connected to MongoDB");
      // Proceed with your application logic
    })
    .catch((error) => {
      res.status(200).json("Error connecting to MongoDB:", error);
    });
});
// app.use("/", (req, res) => {
//   res.end(
//     "<!DOCTYPE html> <html><head> <title>Simple HTML Page</title></head><body>  <h1>Welcome to My Simple HTML Page</h1> <p>This is a basic HTML page created by ChatGPT.</p></body></html> "
//   );
// });

module.exports = app;
