const winston = require('winston');
require ('express-async-errors');
require('winston-mongodb');


module.exports = function () {
    //this accounts for uncaught exceptions outside express
    winston.handleExceptions(  
        new winston.transports.File({filename:'uncaughtexceptions.log'}),
        new winston.transports.Console({colorize:true, prettyPrint:true}),
        // process.exit(1)  
    )

    //delete later ; this accounts for unhandle promise rejections
    process.on('unhandledRejection', (ex)=>{
        throw ex
    })

    //Logging errors globally
    winston.add(winston.transports.File, {filename:'logfile.log'});
    winston.add(winston.transports.MongoDB, {db:'mongodb://localhost/matrix'})

}