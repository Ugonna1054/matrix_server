const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

//define schema 
const loanSchema = new mongoose.Schema({
    status : {
        type:String,
        required:true,
        default:"Pending",
        enum : ["Pending", "Approved", "Declined"]
    }, 
   amount : {
       type:Number,
       required:true
   },
   tenor : {
        type:Number,
        required:true
    },
    purpose : {
        type:String,
        required:true
    },
    account : {
        type:String,
        required:true
    },
    bank : {
        type:String,
        required:true
    },
    user : {
        type : ObjectId,
        required:true,
        ref : "User"
    },
    agent : {
        type : ObjectId,
        ref:"Agent"
    }
},
{
    timestamps: true
})

//define Model
const Loan = mongoose.model("Loan", loanSchema);

//Joi validation function
function validateLoan(user) {
    const schema = Joi.object().keys({
      amount: Joi.number().min(2000).max(100000).required(),
      tenor: Joi.number().min(1).max(6),
      purpose : Joi.string().required().max(100),
      account : Joi.string().required().min(10).max(10),
      bank : Joi.string().required().max(20),
    })
    return schema.validate(user);
}

exports.Loan = Loan
exports.validateLoan = validateLoan
