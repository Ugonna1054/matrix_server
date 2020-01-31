const {Account, SerialNumber} = require ("../models/Account")

const account ={
    //Get all acoounts
    getAccounts : async (req, res) => {
        const account = await Account.find().select("name number -_id").populate("name", "firstname middlename lastname");
        if(!account[0])  return res.status(404).send({success:false, message:"Account not found"})
        res.send(account)
    },

    //Get one Account
    getOneAccount : async (req, res) => {
        let number = req.params.number
        const account = await Account.findOne({number}).select("name number -_id").populate("name", "firstname middlename lastname");
        if(!account) return res.status(404).send({success:false, message:"Account not found"})
        res.send(account)
    },

    //Post serial number
    postSerial : async (req, res) => {
        const number = req.body.number

        const serial = new SerialNumber({
            number
        })

        await serial.save()
        res.send(serial)
    },

     //Get serial number
     getSerial : async (req, res) => {
        const serial = await SerialNumber.find();
        if(!serial[0]) return res.status(404).send({success:false, message:"serial number not found"})
        res.send(serial)
    },

    //create an account number
    createAccount :  async (req, res)  => {
    
        const seed = "373373373373373";
        const serialNumLength = 9;

        let bankCode = `9${req.params.bankCode}`;

        if(bankCode.toString().length!==6 ) return res.status(400).send({success:false,message:"Bank code must be 5 digits" })

        let serialNumber =  req.params.serialNumber.padStart(serialNumLength, "0");
        let nuban = `${serialNumber}${generateCheckDigit(serialNumber, bankCode)}`;

        let account = {
            serialNumber,
            nuban,
            bankCode,
        };

        res.send(account)

        //Function to generate checkdigit
        function generateCheckDigit (serialNumber, bankCode)  {
            if (serialNumber.length > serialNumLength) {
              throw new Error(
                `Serial number should be at most ${serialNumLength}-digits long.`
              );
            }
          
            serialNumber = serialNumber.padStart(serialNumLength, "0");
            let cipher = bankCode + serialNumber;
            let sum = 0;
          
            // Step 1. Calculate A*3+B*7+C*3+D*3+E*7+F*3+G*3+H*7+I*3+J*3+K*7+L*3
            cipher.split("").forEach((item, index) => {
              sum += item * seed[index];
            });
          
            // Step 2: Calculate Modulo 10 of your result i.e. the remainder after dividing by 10
            sum %= 10;
          
            // Step 3. Subtract your result from 10 to get the Check Digit
            let checkDigit = 10 - sum;
          
            // Step 4. If your result is 10, then use 0 as your check digit
            checkDigit = checkDigit == 10 ? 0 : checkDigit;
          
            return checkDigit;
          };
          
    

            
    }
}

module.exports = account