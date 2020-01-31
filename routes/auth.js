const express = require('express');
const router = express.Router();
const auth = require("../controllers/auth");
//const agent = require("../controllers/auth")

//Sign in User (Admin and Customer/user)
router.post('/login', auth.Login)

//Sign in Agent
router.post('/agent/login', auth.LoginAgent)


//Signout User
router.post('/logout', async (req, res) => {
    res.header('x-auth-token', '').send('Logged out Successfully')
});



module.exports = router; 