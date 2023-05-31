const express = require('express');
const { model } = require('mongoose');
const Questios = require('./modal/User');

const Route=express.Router()


Route.post("/Question",(req,res)=>{
    // console.log(req.query.Question);
    // console.log(req.query.Options);
    // console.log(req.query.Correct_Option);
    // Questions.
    const Questions = new Questios(
        {
            Question: req.query.Question,
            Options: req.query.Options,
            Correct_Option:req.query.Correct_Option,
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


Route.get("/Question",(req,res)=>{
    Questios.find({}).then((doc)=>{
        res.status(200).json(doc);
    }).catch((err)=>{
        res.status(500).json(err)
    })
})



module.exports=Route;