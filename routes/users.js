const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const multer  = require('multer');
const user = require("../controllers/user");



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/')
  },
})
 
const upload = multer({ storage: storage })
const cpUpload =  upload.fields([{name:'idCard', maxCount:1},{name:'passport', maxCount:1}])



//Create Agent
router.post('/agent', [auth.auth,admin], cpUpload,  user.agentSignup)

//Get all agents
router.get('/agent', [auth.auth,admin], user.getAgents)

//Get one agent by agent
router.get('/agent/me', auth.auth,  user.getAgentOne)

//Get one agent by Admin
router.get('/agent/:id',  [auth.auth,admin],  user.getAgentOneAdmin)

//Create User/customer
router.post('/', [auth.auth, auth.authorize], cpUpload,  user.userSignup)

//Get all Users/Customer
router.get('/', user.getUsers)

//Get one user
router.get('/me', auth.auth,  user.getUserOne)

/**
 * @description Get all Users attached to an agent
 * @params id => id of the agent
 */
router.get('/:id', user.getUserOneAgent)

//Update a User Account to Approved
router.put('/update/approve/:id', [auth.auth,admin],  user.updateApprove)

//Update a User Account to Declined
router.put('/update/decline/:id', [auth.auth,admin],  user.updateDecline)


module.exports = (router); 