// @Author Kizito Mrema
// @Usage ApiHelper function accepts res, status, String title and Array

const LevelService = require('../services/levelService')
const ErrorHelper = require('../helpers/errorHelper')
const ApiHelper = require('../helpers/apiHelper')

exports.list = async function list (req, res, next) {
    try {
        const levels = await LevelService.list(req.query)
        ApiHelper.response(res, 200, true, "All Levels Found", levels)
    }
    catch (error) {
        ErrorHelper.response(error, res)
    }
}

exports.create = async function (req, res) {
    try {
        const newLevel = await LevelService.create(req)
        ApiHelper.response(res, 201, true, "Level Created!", newLevel)
    }
    catch (error) {
        ErrorHelper.response(error, res)
    }  
}

exports.find = async function find (req, res) {
    try{
        const foundLevel = await LevelService.find(req.params.id)
        ApiHelper.response(res, 200, true, "Level Found!", foundLevel)
    }
    catch (error) {
        ErrorHelper.response(error, res)
    }
}

exports.update = async function update (req, res) {
    try {
        const updatedLevel = await LevelService.update(req, res, req.params.id)
        ApiHelper.response(res, 200, true, "Level updated!", updatedLevel)
    }
    catch (error) {
        ErrorHelper.response(error, res)
    }
}

exports.delete = async function (req, res) {
    try {
        await LevelService.delete(req.params.id)
        ApiHelper.response(res, 202, true, "Deleted", "Level deleted!")
    }
    catch (error) {
        ErrorHelper.response(error, res)
    }
}