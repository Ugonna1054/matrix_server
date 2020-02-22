const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

//init transaction schema
const transactionSchema = new mongoose.Schema({
    status:{
        type:String,
        required:true,
        default:"Pending"
    },
    amount:{
        type:Number,
        required:true
    },
    account : {
        type:String,
        required:true
    },
    type : {
        type:String,
        required:true,
        enum : ["deposit", "withdrawal"]
    },
    agent: {
        type:ObjectId,
        required:true,
        ref : "Agent"
    },
    user : {
        type:ObjectId,
        required:true,
        ref:"User"
    }
},
{
    timestamps: true
  })

//init transaction model
const Transaction = mongoose.model("Transaction", transactionSchema)

exports.Transaction = Transaction