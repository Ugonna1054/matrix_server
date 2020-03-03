const {Loan, validateLoan} = require ("../models/Loan");
const {Account} = require("../models/Account")

const loan ={
    //Get all loan requests
    getLoans : async (req, res) => {
        const loan = await Loan.find().populate("user", "firstname lastname middlename gender phone email -_id").populate("agent", "firstname lastname middlename -_id");
        res.send(loan)
    },

    //Get all loan request for a user/agent
    getLoansOne: async (req, res) => {
        let id = req.user._id
        const loan = await Loan.find({$or:[{user:id}, {agent:id}]}).populate("user", "firstname lastname middlename").populate("agent", "firstname lastname middlename");
        res.send(loan)
    }, 

    //post loan  by customer
    postLoan : async (req, res) => {
        //check for validation errors
        const { error } = validateLoan(req.body); 
        if (error) return res.status(400).send(error.details[0].message);

        //define req.body variables
        const amount = req.body.amount
        const tenor = req.body.tenor
        const account = req.body.account
        const purpose = req.body.purpose
        const bank = req.body.bank
        const user = req.user._id

        //init loan
        const loan = new Loan({
            amount,
            tenor,
            account,
            purpose,
            bank,
            user
        })

         await loan.save();
         res.send({success:true, message:"Loan application successful"})
    },

    //post loan  by agent
    postLoanAgent : async (req, res) => {
        //check for validation errors
        const { error } = validateLoan(req.body); 
        if (error) return res.status(400).send(error.details[0].message);

        //define req.body variables
        const amount = req.body.amount
        const tenor = req.body.tenor
        const account = req.body.account
        const purpose = req.body.purpose
        const bank = req.body.bank
        const agent = req.user._id

        //find user associated with the account
        const account_ = await Account.findOne({"accounts.number":account})
        if(!account_) return res.status(400).send({success:false, message:"Account does not exist"})

        const user =  account_.accounts[0].user

        //init loan
        const loan = new Loan({
            amount,
            tenor,
            account,
            purpose,
            bank,
            user,
            agent
        })

        await loan.save();
        res.send({success:true, message:"Loan application successful"})
    },

    //update loan status to Approved by admin
    updateApprove : async(req, res) => {
        const id = req.params.id;

        //check if loan exists
        const loan = await Loan.findById(id)
        if(!loan) return res.status(404).send({success:false, message:'Loan Not found.'})
        
        //check if loan has been approved already
        if (loan.status == "Approved" || loan.status == "Declined") return res.status(400).send({success:false, message: "Loan has already been approved/declined"})

        //find user associated with the account
        const account = await Account.findOne({"accounts.number":loan.account})
        if(!account) return res.status(400).send({success:false, message:"Account does not exist"});

        //add loan amount to the users account
        let index = account.accounts.findIndex(item => item.number == loan.account)
        let newBalance = account.accounts[index].balance + loan.amount

        //Approve Loan
        loan.status = "Approved"
        await loan.save();

        //update Customer wallet
        await Account.findOneAndUpdate({"accounts.number":loan.account},
        {$set:{
            "accounts.$.balance": newBalance      
        }})

        res.send({success:true, message:"Approved Successfully"})
    },

    //update loan status to Declined by admin
    updateDecline : async(req, res) => {
        const id = req.params.id;

        //check if loan exists
        const loan = await Loan.findById(id)
        if(!loan) return res.status(404).send({success:false, message:'Loan Not found.'})
        
        //check if loan has been approved already
        if (loan.status == "Approved" || loan.status == "Declined") return res.status(400).send({success:false, message: "Loan has already been approved/declined"})
        
        //Declne Loan
        loan.status = "Declined"
        await loan.save();

        res.send({success:true, message:"Declined Successfully"})
    },
}

module.exports = loan