const mongoose = require("mongoose");

const User = mongoose.Schema({
    // _id: mongoose.Types.ObjectId,
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }

})

const Questions = mongoose.Schema({
    // _id: mongoose.Types.ObjectId,
    Question: {
        type: String,
        required: true
    },
    Correct_Option: {
        type: String,
        required: true
    },
    Options: {
        type: Array,
        required: true
    },


})

module.exports=mongoose.model("Users",User)
module.exports=mongoose.model("Questions",Questions)


