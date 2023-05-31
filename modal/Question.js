const Questions = mongoose.Schema({
  // _id: mongoose.Types.ObjectId,
  Question: {
    type: String,
    required: true,
  },
  Correct_Option: {
    type: String,
    required: true,
  },
  Options: {
    type: Array,
    required: true,
  },
});
module.exports = mongoose.model("Questions", Questions);
