// modules
const log = require('winston');
const _ = require('lodash');
const time = new Date();
const ErrorTypes = require('./errorTypes');


function response (error, res) {
    let name = error.name;
    let status = error.status;
    let message = error.message;
    let errors = error.errors;

    if (name === 'ValidationError') {
        status = 400;
        message = "Validation Errors";
        const lodashErrors = _.map(errors, 'message');
        log.error(`${time}- Validation error ( ${status}): ${lodashErrors}`);
    }
    
    else if (name === 'Error') {
        status = 404;
        const lodashErrors = _.map(errors, 'message');
        log.error(`${time}- Not found error ( ${status}): ${lodashErrors}`);
    }

    if (status) {
        return this.errorHelper(error, res)
    }
    else {
        error.status = 500;
        const title = message;
        log.error(`${time}-Internal error ( ${status}): ${title}`);
        return this.errorHelper(error, res)    
    }


}

async function errorHelper (error, res) {
    if (error instanceof ErrorTypes) {
        var status = await error.status;
        var message = await error.message;
        var name = await error.name;
        res.status(status).json({
            success: false,
            title: name,
            message: message
        })
    }
    else {
        await res.status(error.status || 500).json({
            success: false,
            title: error.name || 'Internal',
            message: error.message || 'Internal server error'
        })
    }
}

module.exports = {
    errorHelper,
    response,
};