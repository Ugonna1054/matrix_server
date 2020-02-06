const express = require('express');
const router = express.Router();
const auth = require("../controllers/auth");
const authM = require("../middleware/auth")
//const agent = require("../controllers/auth")

//Sign in User (Admin and Customer/user)
router.post('/login', auth.Login)

//Sign in Agent
router.post('/agent/login', auth.LoginAgent)


//Signout User
router.post('/logout', auth.Logout);

//Change Password User/Admin
router.put("/changePassword", authM.auth, auth.ChangePassword)



module.exports = router; 