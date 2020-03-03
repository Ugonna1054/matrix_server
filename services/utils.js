const fetch = require("node-fetch")

 async function generateAccount (bankCode, serialNumber) {
   //https://matrixx-server.herokuapp.com
   //http://localhost:4000
   const url = `https://matrixx-server.herokuapp.com/api/accounts/banks/${bankCode}/${serialNumber}`;
   return fetch(url, {method:"post"})
   .then(res => res.json())
    .then(data => {
      // console.log(data);
        return (data)
    })
    .catch(err => {
        console.log(err); 
    })
}



 
exports.generateAccount = generateAccount 
