const {Account} = require("../models/Account");
const {Transaction} = require("../models/Transaction");
const {User, Agent} = require("../models/user");
// const {} = require("../models/user")


const transaction = {
    //Get all Transactions
    getTransactions : async (req, res) => {
        const transaction = await Transaction.find().populate("agent", "firstname middlename lastname").populate("user", "firstname middlename lastname")
        if(!transaction[0])  return res.send({success:true, message:"No Transaction yet"})
        res.send(transaction)
    },

    //Get one Transactions
    getTransactionOne : async (req, res) => {
        const transaction = await Transaction.find({$or:[{user:req.user._id}, {agent:req.user._id}]}).populate("agent", "firstname middlename lastname").populate("user", "firstname middlename lastname")
        if(!transaction[0])  return res.status(404).send({success:true, message:"No Transaction yet"})
        res.send(transaction)
    },

    //Post Transaction
    postTransaction : async (req, res) => {
        const account = req.body.account;

        //check if account is existent
        let account_ = await Account.findOne({"accounts.number":account})
        if(!account_) return res.status(404).send({success:false, message:"Account not found"})
        
        //check if user is approved by admin
        let user_ = await User.findOne({_id:account_.accounts[0].user})
        if(!user_) return res.status(404).send("User not found")
        if(user_.status!="Approved") return res.status(403).send({success:false, message:"Account is yet to be approved. Contact Admin"})
       
        //init variables
        const amount = req.body.amount;
        const type = req.params.type;
        const user = account_.accounts[0].user
        const agent = req.user._id

        //update account balance for deposit
        if(type == "deposit") {
            //Agent 
            let agent = await Agent.findById(req.user._id);
            //check if balance is more than 50k
            let newBalance = agent.wallet["balance"] + amount
            if(newBalance > 50000) return res.status(400).send({success:false, message:"Maximum wallet balance reached"})
            
            //Customer
            let index = account_.accounts.findIndex(item => item.number == account)
            let newBalance_ = account_.accounts[index].balance + amount
            
            //update Customer wallet
            await Account.findOneAndUpdate({"accounts.number":account},
                {$set:{
                    "accounts.$.balance": newBalance_       
            }})
            //update Agent wallet
            agent.wallet["balance"] = newBalance;
            agent.wallet["totalDeposit"] = agent.wallet["totalDeposit"] +  amount;
            await agent.save()
        }

        //update account balance for withdrawal
        if(type == "withdrawal") {
            //Agent
            let agent = await Agent.findById(req.user._id);

            //check if balance is sufficient for withdrawal
            if(amount > agent.wallet["balance"]) return res.status(400).send({success:false, message:"Agent Insufficient funds"})
            let newBalance = agent.wallet["balance"] - amount
            
            //if the customer is not an admin
            if(!user_.isAdmin) {
                //Customer
                let index = account_.accounts.findIndex(item => item.number == account)
                let balance = account_.accounts[index].balance

                //check if the balance is sufficient for withdrawal
                if(amount > balance ) return res.status(400).send({success:false, message:"Customer Insufficient funds" })
                let newBalance_ = balance - amount

                //update Customer wallet
                await Account.findOneAndUpdate({"accounts.number":account},
                    {$set:{
                        "accounts.$.balance": newBalance_,       
                }})
                
                //update Agent wallet
                await Agent.findByIdAndUpdate(agent,
                    {$set:{
                        "wallet.balance": newBalance,
                        
                }});
            }

            //if the customer is an admin
            else {
                //Customer
                let index = account_.accounts.findIndex(item => item.number == account)
                let balance = account_.accounts[index].balance

                //add the withdrawal amount to admin's account
                let newBalance_ = balance + amount

                //update Customer wallet
                await Account.findOneAndUpdate({"accounts.number":account},
                    {$set:{
                        "accounts.$.balance": newBalance_,       
                }})
            }

        }
        
        //init Transaction 
        const transaction = new Transaction ({
            amount,
            account,
            type,
            user,
            agent
        })

        await transaction.save()

        res.send({success:true, message:"Transaction Successful"})
    },

    //Update a transaction status to Approved
    updateApprove : async(req, res) => {
        let id = req.params.id;
        let agentId = req.body.agentId

        //check if transaction exists
        let transaction = await Transaction.findById(id)
        if(!transaction) return res.status(404).send({success:false, message:'Transaction Not found.'})
        
        //check if transaction has been approved already
        if (transaction.status == "Approved" || transaction.status == "Declined") return res.status(400).send({success:false, message: "Transaction has already been approved/declined"})
        
        //confirm withdrawal by agent and update agent account
         let agent = await Agent.findById(agentId);
         if(!agent) return res.status(400).send({success:false, message:"Agent not found"})
         let newBalance = agent.wallet["balance"] - transaction.amount

        //Approve Transaction
        transaction.status = "Approved"
        await transaction.save();

        //update Agent wallet
         await Agent.findByIdAndUpdate(agent,
             {$set:{
                "wallet.balance": newBalance,     
         }});
        res.send({success:true, message:"Approved Successfully"})
    },

    //Update a transaction status to Declined
    updateDecline : async(req, res) => {
        let id = req.params.id

        //check if transaction exists
        let transaction = await Transaction.findById(id)
        if(!transaction) return res.status(404).send({success:false, message:'Transaction Not found.'})
        
        //check if transaction has been approved or declined already
        if (transaction.status == "Approved" || transaction.status == "Declined") return res.status(400).send({success:false, message: "Transaction has already been approved/declined"})
        transaction.status = "Declined"
        
        await transaction.save()
        res.send({success:true, message:"Declined Successfully"})
    },

    //update all transactions
    // updateTransactions : async (req, res) => {
    //     let transaction =await Transaction.updateMany(
    //                 {},
    //                 { 
    //                     "$set": {
    //                         "status": "Pending",
    //                     }
    //                 },
    //                 function(err,doc) {
    //             
    //                 }
    //             );
    //    res.send(transaction)
    // },
}

module.exports = transaction