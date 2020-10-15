// @Author Kizito Mrema
// @Usage ApiHelper function accepts res object, boolean status, string title and a data array
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

async function find (req, res) {
    try{
        const foundUser = await UserService.find(req.params.id)
        ApiHelper.response(res, 200, true, "User Found!", foundUser)
    }
    catch (error) {
        ErrorHelper.response(error, res)
    }
}

async function update (req, res) {
    try {
        const updatedUser = await UserService.update(req, res, req.params.id)
        ApiHelper.response(res, 200, true, "User Updated!", updatedUser)
    }
    catch (error) {
        ErrorHelper.response(error, res)
    }
}

async function remove (req, res) {
    try {
        await UserService.remove(req.params.id)
        ApiHelper.response(res, 202, true, "Deleted", "User deleted!")
    }
    catch (error) {
        ErrorHelper.response(error, res)
    }
}

async function login (req, res) {
    try {
        let token = await UserService.login(req)
        ApiHelper.response(res, 200, true, "Login Successful", token)
    }
    catch (error) {
        ErrorHelper.response(error, res)
    }
}

async function seed (req, res) {
    try {
        const adminUser = await UserService.seed()
        ApiHelper.response(res, 200, true, "Admin User Created", adminUser)
    }
    catch (error) {
        ErrorHelper.response(error, res)
    }
}

module.exports = {
    list,
    create,
    find,
    update,
    remove,
    login,
    seed,
}