const jwt = require('jsonwebtoken')
const ErrorTypes = require("../helpers/errorTypes")
const ErrorHelper = require('../helpers/errorHelper')
require('dotenv').config()

const checkToken = (req, res, next) => {
    try {
        let token = req.headers['x-access-token'] || req.headers['authorization'] // express induced lowercase kumbuka
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length)
        }
      
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    throw new ErrorTypes (
                        401,
                        'Unauthorized',
                        'Token is not valid.',
                    )
                } else {
                    req.decoded = decoded
                    next()
                }
            })
        } else {
            throw new ErrorTypes (
                401,
                'No Token',
                'Auth token is not supplied.',
            )
        }
    }
    catch (error) {
        ErrorHelper.response(error, res)
    }
}

module.exports = {
    checkToken: checkToken
}