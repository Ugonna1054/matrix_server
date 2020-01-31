const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

//define schema 
const accountSchema = new mongoose.Schema({
    number : {
        type : String,
        index:true,
        unique:true
    },
    name : {
        type : ObjectId,
        required:true,
        ref : "User"
    }
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
})

//define Model
const SerialNumber = mongoose.model("SerialNumber", serialNumberSchema)

exports.Account = Account,
exports.SerialNumber = SerialNumber