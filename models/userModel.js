
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    salt: {
        type: String,
        required: false,
    },
    saltRounds: {
        type: Number,
        required: false,
    },
    tokenExpiry: {
        type: Number,
        required: false,
    },
    lastLogin: {
        type: Date,
        required: false,
    },
    joinDate: {
        type: Date,
        required: [true, 'Joining date is required'],
    },
    status: {
        type: Boolean,
        required: [true, 'Status is required'],
    },
    person: {
        firstname: {
            type: String,
            required: [true, 'Firstname is required'],
        },
        middlename: {
            type: String,
            required: false,
        },
        lastname: {
            type: String,
            required: [true, 'Last name is required'],
        },
        phone: {
            type: String,
            required: false,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        default: "Admin",
        required: [true, 'createdBy: Is there no creator?']
    },
    updatedBy: {
        type: String,
        default: "Admin",
        required: [true, 'updatedBy: Is the field updated by ghosts?']
    },
    levelId: ObjectId,
},
{
    collection: 'saccoDev'
})

module.exports = mongoose.model('User', userSchema, 'Users');