const express = require('express')
const UserController = require('../Controller/UserController')
const routes = express.Router()
const auth = require('../Middleware/auth')

routes.post('/SignUp', UserController.SignUp);
routes.post('/Login', UserController.Login);
routes.post('/LogOut' , auth , UserController.logOut )
routes.get('/searchUser', auth , UserController.searchUser );
// routes.delete('/', SessionController.store);

module.exports = routes;
