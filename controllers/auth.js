const bcrypt = require('bcrypt');
const {User, Agent, validateLogin} = require('../models/user');


const auth = {
    //Login
    
/**
 *  @description = Login function for user and admin
 */
    Login : async (req, res) => {
     // //check for validation errors
     const { error } = validateLogin(req.body); 
     if (error) return res.status(400).send(error.details[0].message);
    //check for correct username
    let user = await User.findOne({$or:[{"email": req.body.email.toLowerCase()}, {"phone": req.body.email.toLowerCase()}] });
    if (!user) return res.status(400).send({success:false, message:'Invalid username or password.'});
    //check for correct pasword
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send(({success:false, message:'Invalid username or password.'}));
    // using JWT to create token and storing the token in a secret in an Env variable 
    const token = user.generateAuthToken()
    //add token to user object 
    user.token = token
    //set token to x-auth header, send response to client
    res.send({
        token : user.token,
        isAdmin : user.isAdmin,
        requiresChange:user.needsPassword
    });
    },

    //Login Agent
    LoginAgent : async (req, res) => {
         // //check for validation errors
        const { error } = validateLogin(req.body); 
        if (error) return res.status(400).send(error.details[0].message);
        //check for correct username
        let agent = await Agent.findOne({ email: req.body.email.toLowerCase() });
        if (!agent) return res.status(400).send({success:false, message:'Invalid username or password.'});
        //check for correct pasword
        const validPassword = await bcrypt.compare(req.body.password, agent.password);
        if (!validPassword) return res.status(400).send(({success:false, message:'Invalid username or password.'}));
        // using JWT to create token and storing the token in a secret in an Env variable 
        const token = agent.generateAuthToken()
        //add token to user object 
        agent.token = token
        //set token to x-auth header, send response to client
        res.send({
            token : agent.token,
            isAgent : true
        });
    },

    //LOGOUT 
    Logout : async (req,res) => {
        res.send({success:true, message:"Successfully Logged out"})
    },

    //Change Password User
    ChangePassword : async (req, res) => {

        const user = await User.findById (req.user._id)
        
        //Check if user with the given id exists
        if (!user) return res.status(404).send('User not found');
        
        //check if old password is correct
          const validPassword = await bcrypt.compare(req.body.password, user.password);
          if (!validPassword) return res.status(400).send({"msg":'wrong password'});
        
        
        //change password
        user.password = req.body.newPassword
        
        //hash password with salt   
        const salt = await bcrypt.genSalt(10);
        user.password =  await bcrypt.hash(user.password, salt);

        //update "needsPassword field one time"
        user.needsPassword = true
        
        //save user
        await user.save()
        
        res.send({success:true, message:"Password change successful"})
 }
        


}


module.exports = auth