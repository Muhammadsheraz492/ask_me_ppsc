const mongoose = require("mongoose");

const User = mongoose.Schema({
  // _id: mongoose.Types.ObjectId,
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Users", User);
