const express = require('express');
const router = express.Router();
const transaction = require("../controllers/transaction");
const auth = require('../middleware/auth');
const admin = require("../middleware/admin")

//Get all Transactions by admin
router.get("/", [auth.auth, admin], transaction.getTransactions)

//Get all Transaction for one user/agent by user/agent
router.get("/me", auth.auth, transaction.getTransactionOne)

//post transaction by agent
router.post("/:type", [auth.auth, auth.authorize], transaction.postTransaction)

//update transaction status by admin to Approved
router.put('/update/approve/:id', [auth.auth,admin],  transaction.updateApprove)

//Update transaction status by admin to Declined
router.put('/update/decline/:id', [auth.auth,admin],  transaction.updateDecline)

//update all transactions
//router.put("/", transaction.updateTransactions)



module.exports = router; 