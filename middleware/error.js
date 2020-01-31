const winston = require('winston')

module.exports = function (err, req, res, next) {
    winston.error(err)

    if (err.code === 11000) {
        res.status(500).send({
            success: false,
            message : "User already exists"
        })
        return;
    }

    res.status(500).send(err)
}