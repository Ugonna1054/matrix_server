const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

//define acount subdocument
const account = new mongoose.Schema({
    number : {
        type : String,
        index:true,
        unique:true
    },
    name : {
        type : String,
        required:true,
    },
    balance : {
        type: Number,
        required:true,
    },
    user : {
        type:ObjectId,
        required:true
    },
    agent : {
        type:ObjectId,
        required:true
    }
},
{
    timestamps: true
  })

//define schema 
const accountSchema = new mongoose.Schema({
   accounts : [account]
},
{
    timestamps: true
})

//define Model
const Account = mongoose.model("Account", accountSchema);

//define Serial number schema
const serialNumberSchema = new mongoose.Schema({
    number : {
        type : Number,
        unique:true,
        required:true, 
    },
},
{
    timestamps: true
  })

//define Model
const SerialNumber = mongoose.model("SerialNumber", serialNumberSchema)

exports.Account = Account,
exports.SerialNumber = SerialNumber