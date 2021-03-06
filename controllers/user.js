const bcrypt = require('bcrypt');
const {Agent, User, validateAgent, validateUser} = require('../models/user');
const {Account, SerialNumber} = require('../models/Account');
const {newCloudinary1} = require( "../services/cloudinary");
const {generateAccount} = require("../services/utils");

 
const user = {
    //Signup Agent
    agentSignup : async (req, res) => {
    
    //check for validation errors
    const { error } = validateAgent(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    //check for already registered user 
    let user = await Agent.findOne({ email: req.body.email });
    if (user) return res.status(400).send({success:false, message:'Agent already registered.'});

    //save images to cloudinary
    const paths = req.files;
    const values = Object.values(paths)
    const keys = Object.keys(paths);
    let arr = [];
    let errors = []
    let validImage = [];
    let validSize = []

    //check if image is valid
    values.forEach((item) => {
       if(item[0].mimetype == "image/png" || item[0].mimetype =="image/jpeg" || item[0].mimetype =="application/pdf") return;
       validImage.push("invalid")
    })

    //throw eror if not valid
    if(validImage[0]) return res.status(400).send({success:false, message:'Invalid file format. Only jpegs, pngs or pdfs'})

    //check size of the image
    values.forEach((item) => {
        if(item[0].size <= 2000000) return;
        validSize.push("invalid") 
    })

    //throw eror if greater than 2mb 
    if(validSize[0]) return res.status(400).send({success:false, message:'File size must not be more than 2mb'})

    //save image to cloud
    for (let i = 0; i<keys.length; i++) {
        const uniqueFileName = new Date().toISOString()
        await newCloudinary1(values[i][0].path, uniqueFileName)
        .then(data => {
            console.log(data);
            data.name = keys[i]
            arr.push(data)
        })
        .catch(err =>{ 
            console.error(err);
            errors.push(err)  
        })
    }

    //throw err if any
    if(errors[0]) {
        if(errors[0].error.errno =="ENOTFOUND" || errors[0].error.code =="ENOTFOUND" ) return res.status(400).send({success:false, message:"Check your internet connection"});
        res.status(500).send(errors)
    }

    // define req.body variables
    const firstname = req.body.firstname;
    const middlename = req.body.middlename;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const dob = req.body.dob;
    const address = req.body.address;
    const wallet = {
        balance:0
    }
    const idCard = arr[0].secure_url;
    const passport = arr[1].secure_url


    //init agent model
        agent = new Agent ({
            firstname,
            middlename,
            lastname,
            email,
            password,
            phone,
            dob,
            address,
            wallet,
            idCard,
            passport
        })

    //hash password with salt   
    const salt = await bcrypt.genSalt(10);
    agent.password =  await bcrypt.hash(agent.password, salt)

    //save agent
    await agent.save()

    res.send({success:true, message:"Successfully registered"})

 },

 //Get all Agents
 getAgents : async (req, res)  => {
    let agent = await Agent.find().select('-password')
    if(!agent[0]) return res.status(404).send({success:false, message:'No Agents yet.'})
    res.send(agent)
 },

 //Get one Agent profile by agent
 getAgentOne : async(req, res) => {
     let agent = await Agent.findById(req.user._id).select("-password")
     if(!agent) return res.status(404).send({success:false, message:'No Agent found.'})
     res.send(agent)
 },
 //Get one agent by Admin
 getAgentOneAdmin : async(req, res) => {
    let id = req.params.id
    let agent = await Agent.findById(id).select("-password")
    if(!agent) return res.status(404).send({success:false, message:'No Agent found.'})
    res.send(agent)
},

 //signup User/customer
  userSignup : async (req, res) => {
    
    //check for validation errors
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    //check for already registered user 
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({success:false, message:'User already registered.'});

     //save images to cloudinary
     const paths = req.files;
     const values = Object.values(paths)
     const keys = Object.keys(paths);
     let arr = [];
     let errors = []
     let validImage = [];
     let validSize = []


     //check if image is valid
     values.forEach((item) => {
        if(item[0].mimetype == "image/png" || item[0].mimetype =="image/jpeg" || item[0].mimetype =="application/pdf") return;
        validImage.push("invalid")
     })
 
     //throw eror if not valid
     if(validImage[0]) return res.status(400).send({success:false, message:'Invalid file format. Only jpegs, pngs or pdfs'})
 
     //check size of the image
     values.forEach((item) => {
         if(item[0].size <= 2000000) return;
         validSize.push("invalid") 
     })
 
     //throw eror if greater than 2mb 
     if(validSize[0]) return res.status(400).send({success:false, message:'File size must not be more than 2mb'})
 
     //save image to cloud
     for (let i = 0; i<keys.length; i++) {
         const uniqueFileName = new Date().toISOString()
         await newCloudinary1(values[i][0].path, uniqueFileName)
         .then(data => {
             console.log(data);
             data.name = keys[i]
             arr.push(data)
         })
         .catch(err =>{ 
             console.error(err);
             errors.push(err)  
         })
     }
 
     //throw err if any
     if(errors[0]) {
         if(errors[0].error.errno =="ENOTFOUND" || errors[0].error.code =="ENOTFOUND" ) return res.status(400).send({success:false, message:"Check your internet connection"})
         res.status(500).send(errors)
     }

     
    // define user req.body variables
    const firstname = req.body.firstname;
    const middlename = req.body.middlename;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const dob = req.body.dob;
    const address = req.body.address;
    const bvn = req.body.bvn;
    const gender = req.body.gender;
    const agent = req.user._id;
    // const idCard = req.body.idCard;
    const passport = arr[0].secure_url;
  
    //init user model
    user = new User ({
        firstname,
        middlename,
        lastname,
        email,
        password,
        phone,
        dob,
        bvn,
        gender,
        agent,
        address,
        // idCard,
        passport
    })

     //hash password with salt   
     const salt = await bcrypt.genSalt(10);
     user.password =  await bcrypt.hash(user.password, salt);

    await user.save()

    //define serialNumber model variables
    let serialNumber = await SerialNumber.find().sort().select("number -_id")
    const lastSerialNumber = serialNumber[serialNumber.length-1];

    //init Serialnumber Model
    serialNumber = new SerialNumber({
        number : lastSerialNumber.number + 1
    })

    //save serial number
    await serialNumber.save()

    //generate account number
    let nuban = await generateAccount("05867", serialNumber.number + 1);
     
    //Define account model variables
    const number = nuban.nuban;
    const name = `${user.lastname} ${user.firstname} ${user.middlename} `
    const balance = 0;
    const userId = user._id;

    const newAccount = [
        {
            number,
            name,
            balance,
            user:userId,
            agent
        }
    ]
 
     //init Account model
     const accounts = new Account ({
       accounts: newAccount
     })
 
     //save account to database
    await accounts.save()


    //set sccount to acount number
    user.account = accounts._id

    //save user
    await user.save()

    res.send({success:true, message:"Successfully registered", account:number})

 },

 //get all users
 getUsers : async(req,res) => {
    let user = await User.find().populate("agent", "firstname lastname middlename").populate("account", "-_id -__v ").select("-password");
    if(!user[0]) return res.status(404).send({success:false, message:'No users yet.'})
    res.send(user)
 },
  //Get one User profile
  getUserOne : async(req, res) => {
    let user = await User.findById(req.user._id).select("-password").populate("agent", "firstname middlename lastname").populate("account", "-_id -__v ").select("-password");
    if(!user) return res.status(404).send({success:false, message:'No user found.'})
    res.send(user)
},

 //Get users attached to an agent
 getUserOneAgent : async(req, res) => {
    let id = req.params.id
    let user = await User.find({'agent' : id}).select("-password").populate("agent", "firstname middlename lastname");
    if(!user[0]) return res.status(404).send({success:false, message:'No user found.'})
    res.send(user)
},

 //Update a customers account to Approved
 updateApprove : async(req, res) => {
    let id = req.params.id
    let user = await User.findById(id)
    if(!user) return res.status(404).send({success:false, message:'No user found.'})
    user.status = "Approved"
    await user.save()
    res.send({success:true, message:"Approved Successfully"})
},

//Update a customers account to Declined
updateDecline : async(req, res) => {
    let id = req.params.id
    let user = await User.findById(id)
    if(!user) return res.status(404).send({success:false, message:'No user found.'})
    user.status = "Declined"
    await user.save()
    res.send({success:true, message:"Declined Successfully"})
},
}

module.exports = user