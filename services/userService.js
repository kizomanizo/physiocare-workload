const User = require('../models/userModel')
const Level = require('../models/levelModel')
const ErrorTypes = require("../helpers/errorTypes")
const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const ms = require('ms')

async function list(query) {
    const { limit, skip, sort } = query
    const users = await User.find({}).limit(parseInt(limit)).skip(parseInt(skip)).sort(sort)
    if (!users.length) {
        throw new ErrorTypes (
            404,
            'No Records',
            'Huh; No records found.',
        );
    }

    // Covering private parts for every user
    users.forEach(function(user){
        delete user._doc.saltRounds
        delete user._doc.salt
        delete user._doc.password
    })
    
    return users
}

async function create (req, _res) {
    const saltRounds = 11;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const level = await Level.findOne({name: req.body.level});
    const user = new User({
        email: req.body.email,
        password: hash,
        salt: salt,
        saltRounds: saltRounds,
        lastLogin: null,
        tokenExpiry: null,
        status: 0,
        person: {
            firstname: req.body.firstname,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            phone:req.body.phone,
        },
        joinDate: Date(req.body.joinDate),
        createdBy: 1,
        createdAt: Date(),
        levelId: level._id,
    })

    // Persisting unclothed user
    const newUser = await user.save()

    // Covering private parts...
    delete newUser._doc.saltRounds
    delete newUser._doc.salt
    delete newUser._doc.password

    // Yielding prude payload...
    return newUser
}

module.exports = { list, create }