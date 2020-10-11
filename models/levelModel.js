
const mongoose = require('mongoose')

const levelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name: No name? Hmmm!'],
    },
    description: {
        type: String,
        required: false,
    },
    access: {
        type: Number,     // e.g. 2
        required: [true, 'access: A user has to have some access between 0 and 5'],
        min: 0,
        max: 5,
    },
    rights: String,       // comma separated above numbers e.g. 1,2,3,4
    status: Boolean,      // 0 or 1
    createdBy: {
        type: String,
        default: "Admin",
        required: [true, 'createdBy: Is there no creator?']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: String,
        default: "Admin",
        required: [true, 'updatedBy: Is the field updated by ghosts?']

    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
},
{
    collection: 'saccoDev'
})

module.exports = mongoose.model('Level', levelSchema, 'Levels');