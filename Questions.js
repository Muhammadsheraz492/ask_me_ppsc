const express = require('express');
const { model } = require('mongoose');
const Questios = require('./modal/User');
const Category = require('./modal/Category');
const Route = express.Router()
const multer = require('multer');
const Paper = require('./modal/Paper');
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
Route.post('/Category',upload.single("image"), (req, res) => {
  // const pdfPath = req.file.filename;
  console.log(req.file.path);
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
                        Category_Image:req.file.path

                    });
                    category
                        .save()
                        .then(() => {
                            res.status(200).json({
                                status: true,
                                imagePath:req.file.path,
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



Route.post("/past_paper",upload.single("pdf"), async (req, res) => {
    try {
      const { Category_Name, Paper_Pdf, Paper_year, Paper_Name } = req.body;
      const pdfPath = req.file.filename;
   
      const paper = new Paper({
        Category_Name,
        Paper_Pdf:pdfPath,
        Paper_year,
        Paper_Name,
      });
  
      const savedPaper = await paper.save();
  
      res.status(201).json(savedPaper);
    } catch (error) {
      console.error("Error creating paper:", error);
      res.status(500).json({ error: "An error occurred while creating the paper" });
    }
  });
  
  Route.get("/past_paper", async (req, res) => {
    try {
      const papers = await Paper.find();
      res.json(papers);
    } catch (error) {
      console.error("Error retrieving papers:", error);
      res.status(500).json({ error: "An error occurred while retrieving papers" });
    }
  });
module.exports = Route;