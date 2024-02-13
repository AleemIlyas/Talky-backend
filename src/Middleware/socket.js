const jwt = require('jsonwebtoken')

const socketAuth = async (socket, next) => {
    try {
        // Extract the token from the handshake headers
        const token = socket.handshake.headers.authorization;
        const payload = await jwt.verify(token, process.env.JWT_SECERT);

        socket.handshake.auth.user = payload._id;
        next();
    } catch (error) {
        console.error('Socket authentication failed:', error.message);
        next(Error('Authentication error'));
    }
};

module.exports = socketAuth