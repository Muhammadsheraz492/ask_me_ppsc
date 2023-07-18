const mongoose = require("mongoose");


const Paper = mongoose.Schema({
    // _id: mongoose.Types.ObjectId,
    Category_Name: {
      type: String,
      required: true,
    },
    Paper_Pdf:{
      type:String,
      required:true
    },
   Paper_year:{
     type:String,
     required:true
   },
   Paper_Name:{
    type:String,
    required:true
   }
  });
  module.exports = mongoose.model("Paper", Paper);
  