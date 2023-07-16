const express = require('express');
const { model } = require('mongoose');
const Questios = require('./modal/User');
const Category = require('./modal/Category');
const Route = express.Router()
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify the folder where you want to store the uploaded images
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
    }
  });
  const upload = multer({ storage: storage });

Route.post("/Question", (req, res) => {

    const Questions = new Questios(
        {
            Question: req.query.Question,
            Options: req.query.Options,
            Correct_Option: req.query.Correct_Option,
        }
    )
    Questions.save().then(() => {
        res.end("Okey Data Has Been Added")

    }).catch((err) => {
        console.log(err);
        res.end("Somthing Went Wrong")

    })
    // res.end("hello")
})


Route.get("/Question", (req, res) => {
    Questios.find({}).then((doc) => {
        res.status(200).json(doc);
    }).catch((err) => {
        res.status(500).json(err)
    })
})
Route.post('/Category', (req, res) => {
    try {
        Category.find({ Category_Name: req.body.Category_Name })
            .then((doc) => {
                // console.log(doc.length);
                if (doc.length >= 1) {
                    res.status(200).json({
                        status: false,
                        message: "This Category Already Exist"
                    });
                } else {

                    const category = new Category({
                        Category_Name: req.body.Category_Name,

                    });
                    category
                        .save()
                        .then(() => {
                            res.status(200).json({
                                status: true,
                                message: "Category Added"
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(200).json({
                                status: false,
                                message: "Something went Wrong"
                            });
                        });

                }
            })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Server Crashed"
        });
    }
})
Route.get("/Category",(req,res)=>{
  Category.find({}).then((doc)=>{
     res.status(200).json({
        "status":true,
        data:doc

     })
  }).catch((err)=>{
    res.status(200).json({
        status: false,
        message: err
    });
  })
})




module.exports = Route;