const mongoose = require("mongoose");


const Questions = mongoose.Schema({
    // _id: mongoose.Types.ObjectId,
    Category_Name: {
      type: String,
      required: true,
    },
    Category_Image:{
      type:String,
      required:true
    }
 
  });
  module.exports = mongoose.model("Category", Questions);
  