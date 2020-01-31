const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

//define agent schema
const agentSchema = new mongoose.Schema({
     firstname: {
        type: String,
        required: true
    },
    middlename: {
      type: String,
    },
    lastname: {
      type: String,
      required: true
    },
    email :{
        index: true,
        type: String,
        unique: true,
        required: true
    },
    role : {
      type : String,
      default:"Agent",
      enum : ["Agent"]
    },
    phone: {
      type: String,
      required: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    address: {
      type: String,
      required: true
    },
   idCard : {
    type : String,
    required : true
   },
   passport : {
    type : String,
    required : true
   },
    isAdmin: Boolean,
},
{
  timestamps: true
})

//function to generate jwt token
agentSchema.methods.generateAuthToken = function() { 
    const token = jwt.sign({
      _id: this._id, 
      isAdmin: this.isAdmin,
      role : this.role
    }, 
      config.get('myPrivateKey'), 
      { expiresIn:'1w'}
    );
    return token;
}

//define model
const Agent = mongoose.model('Agent', agentSchema)

//Joi validation function
function validateAgent(user) {
    const schema = Joi.object().keys({
      firstname: Joi.string().min(3).max(15).required(),
      middlename: Joi.string().min(3).max(15).allow(""),
      lastname : Joi.string().required().min(3).max(15),
      email : Joi.string().required().email(),
      password : Joi.string().required().min(6).max(20),
      phone : Joi.string().required().min(11).max(15),
      dob : Joi.string().required().max(20),
      address : Joi.string().required().max(30),
      idCard :Joi.allow(""),
      passport : Joi.allow(""),
    })

    return schema.validate(user);
}


//define user schema
const userSchema = new mongoose.Schema({
  status : {
    type: String,
    default :"Pending"
  },
  firstname: {
     type: String,
     required: true
 },
 middlename: {
   type: String,
 },
lastname: {
  type: String,
   required: true
},
 email :{
     index: true,
     type: String,
     unique: true,
     required: true
 },
 phone: {
   type: String,
   required: true
},
 password: {
     type: String,
     required: true
 },
 dob: {
     type: String,
     required: true
 },
 address: {
   type: String,
   required: true
},
// idCard : {
//  type : String,
//  required : true
// },
passport : {
 type : String,
//  required : true
},
account :  {
  type : String
},
bvn :{
  type: String
},
 isAdmin: Boolean,
},
{
timestamps: true
})


//function to generate jwt token
userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({
    _id: this._id, 
    isAdmin: this.isAdmin,
  }, 
    config.get('myPrivateKey'), 
    { expiresIn:'1w'}
  );
  return token;
}

//define model 
const User = mongoose.model('User', userSchema);

//Joi validation function
function validateUser(user) {
  const schema = Joi.object().keys({
    firstname: Joi.string().min(3).max(15).required(),
    middlename: Joi.string().min(3).max(15).allow(""),
    lastname : Joi.string().required().min(3).max(15),
    email : Joi.string().required().email(),
    password : Joi.string().required().min(6).max(20),
    phone : Joi.string().required().min(11).max(15),
    dob : Joi.string().required().max(20),
    bvn : Joi.string().min(11).max(11).allow(""),
    account : Joi.string().min(10).max(10).allow(""),
    address : Joi.string().required().max(30),
    // idCard :Joi.allow(""),
    passport : Joi.allow(""),
  })

  return schema.validate(user);
}



//Joi validation function for login
function validateLogin(user) {
  const schema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().min(3).max(15).required(),
  })

  return schema.validate(user);
}

exports.Agent = Agent
exports.User = User
exports.validateAgent = validateAgent
exports.validateLogin = validateLogin
exports.validateUser = validateUser