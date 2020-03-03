const express = require('express');
const router = express.Router();
const loan = require("../controllers/loan");
const auth = require('../middleware/auth');
const admin = require("../middleware/admin")

//get all loan requests by admin
router.get("/", [auth.auth, admin], loan.getLoans)

//get all loan requests by admin
router.get("/me", [auth.auth], loan.getLoansOne);

//post loan by customer
router.post("/", auth.auth, loan.postLoan);

//post loan by agent
router.post("/agent", [auth.auth, auth.authorize], loan.postLoanAgent)

//update loan status by admin to Approved
router.put('/update/approve/:id', [auth.auth,admin],  loan.updateApprove)

//Update loan status by admin to Declined
router.put('/update/decline/:id', [auth.auth,admin],  loan.updateDecline)



module.exports = router; 