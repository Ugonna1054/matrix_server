const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const account = require("../controllers/account");

//post and get all serial number
router.route ("/serial")
    .post(account.postSerial)
    .get(account.getSerial)


//Get all accounts
router.route("/")
    .get([auth.auth, admin], account.getAccounts)

//Get One Account
router.route('/:number')
    .get(account.getOneAccount)

//Create new Account
router.post('/banks/:bankCode/:serialNumber', account.createAccount)




module.exports = router; 