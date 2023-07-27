const express = require('express');
const { model } = require('mongoose');
const Questios = require('./modal/Question');
const Category = require('./modal/Category');
const { initializeApp } = require('firebase/app')
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require('firebase/storage');
const Route = express.Router()
const multer = require('multer');
const Paper = require('./modal/Paper');
const Books = require('./modal/Books');
const firebaseConfig = {
  apiKey: "AIzaSyACQGtdj4qFxD6QPiP0omlaOBkz7zTMJMI",
  authDomain: "ppsc-db25f.firebaseapp.com",
  projectId: "ppsc-db25f",
  storageBucket: "ppsc-db25f.appspot.com",
  messagingSenderId: "220832175925",
  appId: "1:220832175925:web:1b4b879e17c4c7e0a7de7c"
};

initializeApp(firebaseConfig);
const storage = getStorage();
const upload = multer();
Route.post("/Question", async (req, res) => {
  try {
    const data = await Category.find({ Category_Name: req.query.Category_Name })
    // console.log("Category :",data);
    if (data.length >= 1) {


      const Questions = new Questios(
        {
          Question: req.query.Question,
          Options: req.query.Options,
          Correct_Option: req.query.Correct_Option,
          Category_Name: req.query.Category_Name
        }
      )
      await Questions.save();
      res.end("Okey Data Has Been Added")
    }
    else {
      res.end("Category Not Founded")
    }
  } catch (error) {

    res.end("Somthing Went Wrong")
  }
})


Route.get("/Question", (req, res) => {
  Questios.find({}).then((doc) => {
    res.status(200).json(doc);
  }).catch((err) => {
    res.status(500).json(err)
  })
})
Route.post('/Category', upload.single("image"), async (req, res) => {
  try {

    const data = await Category.find({ Category_Name: req.body.Category_Name })
    if (data.length >= 1) {
      res.status(200).json({
        status: false,
        message: "This Category Already Exist"
      });

    }
    const dateTime = giveCurrentDateTime();
    const storageRef = ref(storage, `files/${req.file.originalname + "       " + dateTime}`);
    const metadata = {
      contentType: req.file.mimetype,
    };
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    const category = new Category({
      Category_Name: req.body.Category_Name,
      Category_Image: downloadURL

    });
    await category.save();
    return res.send({
      status: true,
      imagePath: req.file.path,
      message: "Category Added"
    });
  } catch (error) {
    return res.status(400).send(error.message)
  }
});

Route.get("/Category", (req, res) => {
  Category.find({}).then((doc) => {
    res.status(200).json({
      "status": true,
      data: doc

    })
  }).catch((err) => {
    res.status(200).json({
      status: false,
      message: err
    });
  })
})
Route.get("/Find_Question", async(req, res) => {
  // Category.find({}).then((doc) => {
  //   res.status(200).json({
  //     "status": true,
  //     data: doc

  //   })
  // }).catch((err) => {
  //   res.status(200).json({
  //     status: false,
  //     message: err
  //   });
  // })
  try {
    const Data=await Questios.find({Category_Name:req.query.Category_Name})
  return res.send({
    status:true,
    data:Data
  })
    
  } catch (error) {
    res.status(201).json({
      status:false,
      Error_message:error
    })
  }


})




Route.post("/past_paper", upload.single("pdf"), async (req, res) => {
  try {
    const { Category_Name, Paper_Pdf, Paper_year, Paper_Name } = req.body;
    const pdfPath = req.file.filename;
    const dateTime = giveCurrentDateTime();
    const storageRef = ref(storage, `files/${req.file.originalname + "       " + dateTime}`);
    const metadata = {
      contentType: req.file.mimetype,
    };
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    const paper = new Paper({
      Category_Name,
      Paper_Pdf: downloadURL,
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
Route.post("/post_books",upload.fields([
  {name:"book_url",maxCount:1},
  {name:"book_image",maxCount:1},
]),async(req,res)=>{
  try {
    const { Category_Name, Paper_Pdf, Paper_year, Paper_Name } = req.body;
    const pdfPath = req.files.book_url[0].filename;
    const BookIMageUrl = req.files.book_image[0].filename;
    const dateTime = giveCurrentDateTime();
    const storageRef = ref(storage, `Books/${req.files.book_url[0].originalname + "       " + dateTime}`);
    const storageRef1 = ref(storage, `Books_Images/${req.files.book_image[0].originalname + "       " + dateTime}`);
    const metadata = {
      contentType: req.files.book_url[0].mimetype,
    };
     const book_metadata = {
      contentType: req.files.book_image[0].mimetype,
    };
    const snapshot = await uploadBytesResumable(storageRef, req.files.book_url[0].buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
        const snapshot_Image = await uploadBytesResumable(storageRef1, req.files.book_image[0].buffer, book_metadata);
    const downloadURL_Image = await getDownloadURL(snapshot_Image.ref);

     const Book=new Books({
     BookName:req.body.BookName,
     Book_Image:downloadURL_Image,
     Book_url:downloadURL
     })

    const savedPaper = await Book.save();

    res.status(201).json(savedPaper);
  } catch (error) {
    console.error("Error creating paper:", error);
    res.status(500).json({ error: "An error occurred while creating the paper" });
  }
});
Route.get("/get_books", async (req, res) => {
  try {
    const papers = await Books.find();
    res.json(papers);
  } catch (error) {
    console.error("Error retrieving papers:", error);
    res.status(500).json({ error: "An error occurred while retrieving Books" });
  }
});
Route.get("/past_paper", async (req, res) => {
  console.log(req.query);
  try {
    const papers = await Paper.find({Category_Name:req.query.Category_Name});
    res.json(papers);
  } catch (error) {
    console.error("Error retrieving papers:", error);
    res.status(500).json({ error: "An error occurred while retrieving papers" });
  }
});
Route.get("/get_mock_question",async(req,res)=>{
  const Questions=await Questios.aggregate([
  { $sample: { size: 10 } }
]);
res.json(Questions);
})
module.exports = Route;
const giveCurrentDateTime = () => {
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + ' ' + time;
  return dateTime;
}
