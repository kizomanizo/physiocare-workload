// modules
const log = require('winston');
const _ = require('lodash');
const time = new Date();
const ErrorTypes = require('./errorTypes');

async function response (error, res) {
    if (error instanceof ErrorTypes) {
        const status = await error.status
        const message = await error.message
        const name = await error.name
        const errors = await error.errors
        const lodashErrors = _.map(errors, 'message')
        log.error(`${time}- Validation error ( ${status}): ${lodashErrors}`)
        res.status(status).json({
            success: false,
            title: name,
            message: message
        })
    }
    else {
        log.error(`${time}-Internal error ( ${error.status || 500}): ${error.name || 'Internal'}`)
        await res.status(error.status || 500).json({
            success: false,
            title: error.name || 'Internal',
            message: error.message || 'Internal server error'
        })
    }
}

module.exports = {
    response,
};