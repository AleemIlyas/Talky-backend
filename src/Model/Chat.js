const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    roomName: {
        type: 'String',
        required: true,
        trim: ''
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }],
    isGroupChat: {
        type: Boolean,
        required: true,
        default: false
    },
    admin: [{
        type: mongoose.Schema.Types.ObjectId,
    }]
}, {
    timestamps: true
})
const Chat = mongoose.model('Chat', chatSchema)
module.exports = Chat
