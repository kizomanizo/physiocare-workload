const User = require('../models/userModel')
const Level = require('../models/levelModel')
const ErrorTypes = require("../helpers/errorTypes")
const bcrypt = require('bcrypt')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const ms = require('ms')
const tokenExpiry = new Date (Date.now() + ms(process.env.JWT_EXPIRATION));

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
    const saltRounds = 11
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(req.body.password, salt)
    const level = await Level.findOne({name: req.body.level})
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


async function find (id) {
    const foundUser = await User.findById(id)
        // Covering private parts...
        delete foundUser._doc.saltRounds
        delete foundUser._doc.salt
        delete foundUser._doc.password
    if(!foundUser) {
        throw new ErrorTypes(
            404,
            'Not Found',
            'Yikes; User not found.',
        );
    }
    return foundUser
}


async function update (req, _res, id) {
    const updatedUser = await User.findById(id)
    if(!updatedUser) {
        throw new ErrorTypes(
            404,
            'Bad Request',
            'Error: User not updated!',
        )
    }
    else {
        if  (req.body.firstname != null ) { updatedUser.person.firstname = req.body.firstname }
        if ( req.body.middlename != null ) { updatedUser.person.middlename = req.body.middlename }
        if ( req.body.lastname != null ) { updatedUser.person.lastname = req.body.lastname }
        if ( req.body.phone != null ) { updatedUser.person.phone = req.body.phone }
        if ( req.body.email != null ) { updatedUser.email = req.body.email }
        if ( req.body.password != null ) {
            const saltRounds = 10
            const salt = bcrypt.genSaltSync(saltRounds)
            const hash = bcrypt.hashSync(req.body.password, salt)
                updatedUser.user.password = hash
                updatedUser.user.salt = salt
                updatedUser.user.saltRounds = saltRounds
         }
        if ( req.body.status != null ) { updatedUser.status = req.body.status }
        if ( req.body.level != null ) { 
            const level = await Level.findOne({name: req.body.level})
            updatedUser.levelId = level._id
        }
        updatedUser.updatedBy = "New Updater"
        updatedUser.updatedAt = Date()
        await updatedUser.save();
        return updatedUser;
    }   
}


async function remove (id) {
    const userToRemove = await User.findById(id)
    if (!userToRemove) {
        throw new ErrorTypes(
            404,
            'NotFound',
            'Yikes; User not Found.',
        )
    }
    else {
        await User.deleteOne( {_id: id} )
        return
    }      
}


async function login (req) {
    const user = await User.findOne({ email: req.body.email }).exec();
    const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            let token = jwt.sign({email: req.body.email},
                process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRATION, // it can be 1m, 2h, 60d, 1y, 6000(1 minute), etc.
                });
            user.tokenExpiry = tokenExpiry
            user.lastLogin = Date()
            user.save()

            return token
        }
        else {
            throw new ErrorTypes(
                400,
                'Failed',
                'Incorrect email or password.',
            )
        }
}


async function seed (req, _res) {
    const saltRounds = 11
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync('admin', salt)
    var level = await Level.findOne({name: 'admin'}).exec()
    if (level == null) {
        const newLevel = new Level()
        newLevel.name = 'admin'
        newLevel.description = 'Initial admin level'
        newLevel.access = '1'
        newLevel.rights = '1,2,3,4,5'
        newLevel.status = 1
        newLevel.createdBy = "System"
        newLevel.createdAt = Date()
        newLevel.updatedBy = "System"
        newLevel.updatedAt = Date()
        await newLevel.save()
        
    }
    
    const admin = await User.findOne({email: 'admin@example.com'}).exec()
    if (admin == null) {
        const levelNew = await Level.findOne({name: 'admin'})
        const user = new User({
            email: 'admin@example.com',
            password: hash,
            salt: salt,
            saltRounds: saltRounds,
            lastLogin: null,
            tokenExpiry: null,
            status: 0,
            person: {
                firstname: 'Initial',
                middlename: null,
                lastname: 'Admin',
                phone: null,
            },
            joinDate: Date(),
            createdBy: 'System',
            createdAt: Date(),
            levelId: levelNew._id,
        })
    
        // Persisting unclothed user
        const adminUser = await user.save()
    
        // Covering private parts...
        delete adminUser._doc.saltRounds
        delete adminUser._doc.salt
        delete adminUser._doc.password
    
        // Yielding prude payload...
        return adminUser
    } else {
        throw new ErrorTypes(
            401,
            'Unauthorized',
            'Admin user already exists, consider changing the password.',
        )
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