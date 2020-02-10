const {Account} = require("../models/Account");
const {Transaction} = require("../models/Transaction");
const {User} = require("../models/user")


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
           let index = account_.accounts.findIndex(item => item.number == account)
           let newBalance = account_.accounts[index].balance + amount
           await Account.findOneAndUpdate({"accounts.number":account},
            {$set:{
                "accounts.$.balance": newBalance,
                
            }})
        }

        //update account balance for withdrawal
        if(type == "withdrawal") {
        let index = account_.accounts.findIndex(item => item.number == account)
        let balance = account_.accounts[index].balance
        if(amount > balance ) return res.status(400).send({success:false, message:"Insufficient funds" })
        let newBalance = balance - amount
        await Account.findOneAndUpdate({"accounts.number":account},
            {$set:{
                "accounts.$.balance": newBalance,
                
            }})
        }
 
        //init Tranaction 
        const transaction = new Transaction ({
            amount,
            account,
            type,
            user,
            agent
        })

        await transaction.save()

        res.send({success:true, message:"Transaction Successful"})
    }
}

module.exports = transaction