const express  = require('express')
const socket = require('socket.io');
const port = process.env.PORT || 4000;
const cors = require('cors')
const app =  express();
app.use(cors())


require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/prod')(app)


app.listen(port,()=>{
  console.log("Howdy, I am running at PORT " + port)
})



