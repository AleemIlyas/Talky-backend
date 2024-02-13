const jwt = require('jsonwebtoken')
const User = require('../Model/User')
const { logOut } = require('../Controller/UserController')

const auth = async (req, res, next) => {

    try {
        let token = req.header('Authorization')
        if (!token) throw Error('Authentication token is missing!')
        token = token.replace('Bearer ', "")
        const payload = jwt.verify(token, process.env.JWT_SECERT)
        if (Date.now() > payload.expiredAt * 1000) {
            console.log('hello......................', payload)
        }
        const user = await User.findOne({ _id: payload._id, 'tokens.token': token })
        if (!user) throw new Error('User not found!')
        req.user = user
        req.token = token
        next()
    }
    catch (err) {
        // if (err.name === 'TokenExpiredError') {
        //     try {
        //         // Perform logout actions (remove token from user's tokens array)
        //         const filteredToken = req.user.tokens.filter((userToken) => userToken.token !== req.token);
        //         req.user.tokens = filteredToken;
        //         await req.user.save();
        //     } catch (logoutError) {
        //         console.log('Error during logout:', logoutError);
        //     }
        //     res.status(401).json({ 'error': 'Token has expired. Please log in again.' });
        // }
        // else {
        // Other errors
        res.status(403).json({ 'message': err.message });
    }
}

module.exports = auth