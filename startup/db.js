const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
    const db = config.get('db');
    mongoose.connect(db)
    .then(_ => winston.info('Connected to matrix db......'))
    .catch (_ => winston.error("couldnt connect") )
}