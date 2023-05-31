const express = require('express');
const User = require('./modal/User');
const bcrypt=require('bcrypt');
const { default: mongoose } = require('mongoose');
const Customer = express.Router();
Customer.post("/Signup", (req, res) => {
    console.log(req.query.username);
    User.find({email:req.query.email}).then((doc)=>{
        // console.log(doc.length);
        if (doc.length>=1) {
            res.end("This is Already Exist")
        }else{
            bcrypt.hash(req.query.password,10,(err,hash)=>{
                if(err) throw err;

                const user = new User(
                        {
                            username: req.query.username,
                            email: req.query.email,
                            password: hash,
                            status: true
                        }
                    )
                    user.save().then(() => {
                        res.end("Okey Data Has Been Added")
    
                    }).catch((err) => {
                        console.log(err);
                        res.end("Somthing Went Wrong")
    
                    })
            })
        }
        

    }).catch((err)=>{
        console.log(err);
    })
})
Customer.post('/Login',(req,res)=>{
    console.log(req.query.email);
    User.find({email:req.query.email}).then((doc)=>{
        bcrypt.compare(req.query.password,doc[0].password,(error,result)=>{
            if(result){
                console.log("Compared password is Correct");
                // res.end("Correct")
                res.status(200).json({
                    "status":true,
                    "message":"User SccuessFully Login"
                })
            }else{
                res.status(500).json({
                    "status":false,
                    "message":" username and password is wrong"
                })
            }
        })
    }).catch((err)=>{
        console.log(err);
    res.status(404).json({
        "status":false,
        "message":" username and password is wrong"
    })
    })
})





module.exports = Customer;