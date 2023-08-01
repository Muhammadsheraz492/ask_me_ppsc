const express = require("express");
const User = require("./modal/User");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
var nodemailer = require('nodemailer');

const Customer = express.Router();
function generateOTP() {
  // Generate a random 4-digit number between 1000 and 9999
  const otp = Math.floor(Math.random() * 9000) + 1000;
  return otp.toString();
}

async function SendEmail(val, val1) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: val,
    subject: 'Sending Email using Node.js',
    text: val1,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    throw error;
  }
}

Customer.post("/Signup", (req, res) => {
  console.log(req.body.username);
  try {
    User.find({ email: req.body.email })
      .then((doc) => {
        // console.log(doc.length);
        if (doc.length >= 1) {
          res.end("This is Already Exist");
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) throw err;

            const user = new User({
              username: req.body.username,
              email: req.body.email,
              password: hash,
              status: true,
            });
            user
              .save()
              .then(() => {
                res.end("Okey Data Has Been Added");
              })
              .catch((err) => {
                console.log(err);
                res.end("Somthing Went Wrong");
              });
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
});
Customer.post("/Login", (req, res) => {
  console.log(req.query.email);

  User.find({ email: req.query.email })
    .then((doc) => {
      bcrypt.compare(req.query.password, doc[0].password, (error, result) => {
        if (result) {
          console.log("Compared password is Correct");
          // res.end("Correct")
          res.status(200).json({
            status: true,
            message: "User SccuessFully Login",
          });
        } else {
          res.status(500).json({
            status: false,
            message: " username and password is wrong",
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({
        status: false,
        message: " username and password is wrong",
      });
    });
});
Customer.post("/reset_email", async (req, res) => {
  console.log(req.query);
  try {
    const doc = await User.find({ email: req.query.email });
    const otp = generateOTP();

    if (doc.length >= 1) {
      try {
        await SendEmail(req.query.email, otp);
        res.json({
          status: true,
          message: "Email Found",
          otp: otp,
        });
      } catch (error) {
        console.log('Email sending error:', error);
        res.json({
          status: false,
          message: "Error sending email",
        });
      }
      console.log('OTP:', otp);
    } else {
      res.json({
        status: false,
        message: "Email Not Found",
      });
    }
  } catch (error) {
    console.log('Database error:', error);
    res.json({
      status: false,
      message: "Database error",
    });
  }
});



Customer.post("/new_password",async(req,res)=>{
try {
  let doc = await User.find({ email: req.query.email })
  if (doc.length>=1) {
    bcrypt.hash(req.query.password, 10,async (err, hash) => {
      if (err) throw err;
      const updatedUser = await User.findOneAndUpdate(
        { email: req.query.email},
        { password: hash },
        { new: true } // Setting { new: true } returns the updated document, otherwise, it returns the original document
      );
      if(updatedUser){
        res.json({
          status:true,
          message:"Password Updated"
        })
      }else{
        res.json({
          status:true,
          message:"Something went Wrong"
        })
      }
    
    })
  }else{
    res.json({
      status:false,
      message:"User not Found"
    })
  }
} catch (error) {
  res.json({
    status:false,
    Error:error
  })
} 



})
module.exports = Customer;
