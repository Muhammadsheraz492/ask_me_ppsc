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
const SendEmail = (val, val1) => {

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'razakhan.yt0012@gmail.com',
      pass: 'cvmzenrnkczdipxe'
    }
  });

  var mailOptions = {
    from: 'razakhan.yt0012@gmail.com',
    to: val,
    subject: 'Sending Email using Node.js',
    text: val1
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
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
    let doc = await User.find({ email: req.query.email })
    const otp = generateOTP();
    if (doc.length >= 1) {
      SendEmail(req.query.email, otp);
      console.log(otp);

      res.json({
        status: true,
        message: "Email  Founded",
        otp: otp
      })
    } else {
      res.json({
        status: true,
        message: "Email Not Found",
        doc: doc
      })
    }
    res.json(doc)
  } catch (error) {
    res.json(error)
  }

})


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
