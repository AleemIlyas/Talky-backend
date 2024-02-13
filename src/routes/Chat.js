const express = require('express')
const chatController = require('../Controller/chatController')
const routes = express.Router()
const auth = require('../Middleware/auth');

routes.post('/createGroupChat', auth, chatController.createGroup);
routes.post('/createChat', auth, chatController.createChat);
routes.get('/chats', auth, chatController.getChats)
routes.post('/chat', auth, chatController.getChat)
routes.post('/accessChat', auth, chatController.accessChat)

module.exports = routes;
