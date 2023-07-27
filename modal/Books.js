
const mongoose = require("mongoose");

const Books = mongoose.Schema({
  // _id: mongoose.Types.ObjectId,
  BookName: {
    type: String,
    required: true,
  },
  Book_Image: {
    type: String,
    required: true,
  },
  Book_url: {
    type: String,
    required: true,
  }
});
module.exports = mongoose.model("Books", Books);
