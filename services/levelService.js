const Model = require('../models/levelModel')
const ErrorTypes = require("../helpers/errorTypes")

exports.list = async function list (query) {
    const { limit, skip, sort } = query
    const levels = await Model.find({})
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .sort(sort)
    if (!levels.length) {
        throw new ErrorTypes (
            404,
            'No Records',
            'Huh; No records found.',
        );
    }
    
    return levels
}

exports.create = async function (req, _res) {
    const newLevel = new Model(req.body)
    newLevel.name = req.body.name
    newLevel.description = req.body.description
    newLevel.access = req.body.access
    newLevel.rights = req.body.rights
    newLevel.status = 0
    newLevel.createdBy = "Director"
    newLevel.createdAt = Date()
    newLevel.updatedBy = "Updater"
    newLevel.updatedAt = Date()

    return newLevel.save()
}

exports.find = async function (id) {
    const foundLevel = await Model.findById(id)
    if(!foundLevel) {
        throw new ErrorTypes(
            404,
            'Not Found',
            'Yikes; Level not found.',
        );
    }
    return foundLevel
}

exports.update = async function (req, res, id) {
    const updatedLevel = await Model.findById(id)
    if(!updatedLevel) {
        throw new ErrorTypes(
            404,
            'Bad Request',
            'Error: Level not updated!',
        )
    }
    else {
        if  (req.body.name != null ) { updatedLevel.name = req.body.name }
        if ( req.body.description != null ) { updatedLevel.description = req.body.description }
        if ( req.body.access != null ) { updatedLevel.access = req.body.access }
        if ( req.body.rights != null ) { updatedLevel.rights = req.body.rights }
        if ( req.body.status != null ) { updatedLevel.status = req.body.status }
        updatedLevel.updatedBy = "New Updater"
        updatedLevel.updatedAt = Date()
        await updatedLevel.save();
        return updatedLevel;
    }   
}

exports.remove = async function (id) {
    const levelToRemove = await Model.findById(id)
    if (!levelToRemove) {
        throw new ErrorTypes(
            404,
            'NotFound',
            'Yikes; Level not Found.',
        )
    }
    else {
        await Model.deleteOne( {_id: id} )
        return
    }      
}
