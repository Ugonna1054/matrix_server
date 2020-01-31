const express = require("express");
const users = require('../routes/users');
const auth = require('../routes/auth');
const account = require('../routes/accounts');
const error = require('../middleware/error');


module.exports = function (app) {
    app.use(express.static("public"))
    app.use(express.json({ limit:"50mb", extended:true}));
    app.use(express.urlencoded({ limit:"50mb", extended:true}));
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/accounts', account);
   
   
    //Central eror handling
    app.use(error)                          
}



