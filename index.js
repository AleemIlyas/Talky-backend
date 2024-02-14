const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const compression = require('compression');
app.use(compression())
const bodyParser = require('body-parser')
const cors = require('cors')
const { Server } = require('socket.io')
require('dotenv').config()
const { addMessage, addVoiceMessage } = require('./src/Controller/messageController')
const { accessChat, getChat } = require('./src/Controller/chatController')
const { Blob } = require('buffer')
const PORT = process.env.PORT
const io = new Server(server, {
    cors: {
        origin: 'https://talky-gules.vercel.app'
    }
})
const main = require('./src/db/db');
app.use(cors({
    origin: "https://talky-gules.vercel.app",
    methods: ['GET', 'POST']
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api/user', require('./src/routes/User'))
app.use('/api/user/chat', require('./src/routes/Chat'))
app.use('/api/user/Messages', require('./src/routes/Message'))
app.get('/', (req, res) => {
    res.send("<h1>Hello</h1>")
})

io.use(require('./src/Middleware/socket'))

io.on('connection', (socket) => {
    console.log(socket.id, 'a user connected!')


    const user = socket.handshake.auth.user;
    socket.user = user;

    socket.on('joinroom', (roomId) => {
        socket.join(roomId)
        console.log('User Joined the chatroom', roomId)
    })

    socket.on('accessChat', async (userId, callback) => {
        try {
            const result = await accessChat(userId, user);

            if (result.type) {
                io.to(user).emit('chatExist', result.chat)
            } else {
                io.to(userId).emit('newChat', result._id);
                socket.join(result._id);
                callback({ chatId: result._id });
            }
        } catch (err) {
            // Handle unexpected errors
            console.error('Unexpected error:', err);
            socket.emit('error', { error: 'Something went wrong' });
        }
    });

    socket.on('getChat', async (chatId, callback) => {
        console.log(chatId)
        let chat = await getChat(user, chatId);
        console.log(chat)
        callback(chat)
    })


    socket.on('voiceMessage', async ({ id, data, type }) => {
        try {
            const audioBlob = new Blob([data], { type: type });
            const audioBuffer = await audioBlob.arrayBuffer();
            const base64Audio = Buffer.from(audioBuffer).toString('base64');
            const audioData = `data:audio/mp3;base64,${base64Audio}`;
            let response = await addVoiceMessage(id, audioData, socket.handshake.auth.user, type)

            io.to(id).emit("messageReceived", response)
        }
        catch (err) {
            console.log(err)
        }
    })

    socket.on('audioOffer', (data) => {
        socket.to(data.target).emit('audioOffer', data);
    });

    socket.on('audioAnswer', (data) => {
        socket.to(data.target).emit('audioAnswer', data);
    });

    socket.on('rejectCall', (data) => {
        socket.to(data.target).emit('rejectCall', { message: "Your call Request was Rejected" })
    })

    socket.on('iceCandidate', (data) => {
        socket.to(data.target).emit('iceCandidate', data.candidate);
    });


    socket.on('endCall', ({ target }) => {
        socket.to(target).emit('endCall')
    })

    socket.on('sendMessage', async ({ id, msg }) => {
        try {
            const response = await addMessage(id, msg, socket.handshake.auth.user)
            io.to(id).emit("messageReceived", { response: response, chatId: id })
        }
        catch (err) {
            console.log(err)
        }
    })




    socket.on('disconnect', () => {
        io.emit('discon', 'User disconneted')
        console.log(socket.id, "user disconnected!")
    })


})



const start = async function () {
    try {
        await main(process.env.DB_URL);
        server.listen(PORT, () => {
            console.log("Server is listening on port 3001");
        });
    } catch (error) {
        console.error("An error occurred:", error);
    }
};

start()