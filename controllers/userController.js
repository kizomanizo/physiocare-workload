// @Author Kizito Mrema
// @Usage ApiHelper function accepts res, status, String title and Array

const UserService = require('../services/userService')
const ErrorHelper = require('../helpers/errorHelper')
const ApiHelper = require('../helpers/apiHelper')

async function list (req, res) {
    try {
        const users = await UserService.list(req.query)
        ApiHelper.response(res, 200, true, "All Users Found", users)
    }
    catch (error) {
        ErrorHelper.response(error, res)
    }
}

async function create (req, res) {
    try {
        const newUser = await UserService.create(req)
        ApiHelper.response(res, 201, true, "User Created!", newUser)
    }
    catch (error) {
        ErrorHelper.response(error, res)
    }  
}

module.exports = { list, create }