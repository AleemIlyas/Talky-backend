const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    Messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
        },
        voiceMessage: {
            data: String,
            contentType: String
        }
    }]
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message