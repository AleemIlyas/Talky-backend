const express = require('express')
const auth = require('../Middleware/auth')
const messageController = require('../Controller/messageController')

const routes = express.Router()

// routes.post('/addMessage', auth, messageController.addMessage)
routes.get('/getMessages/:chatId', auth, messageController.getMessages)

module.exports = routes