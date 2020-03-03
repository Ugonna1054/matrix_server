const express = require("express");
const users = require('../routes/users');
const auth = require('../routes/auth');
const account = require('../routes/accounts');
const loan = require('../routes/loans');
const transaction = require('../routes/transactions');
const error = require('../middleware/error');


module.exports = function (app) {
    app.use(express.static("public"))
    app.use(express.json({ limit:"50mb", extended:true}));
    app.use(express.urlencoded({ limit:"50mb", extended:true}));
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/accounts', account);
    app.use('/api/loans', loan);
    app.use('/api/transactions', transaction);
   
   
    //Central eror handling
    app.use(error)                          
}



