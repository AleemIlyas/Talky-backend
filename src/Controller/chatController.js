const Chat = require('../Model/Chat')
const User = require('../Model/User')

class chatController {
    static async createGroup(req, res) {
        try {
            const chat = new Chat({
                ...req.body,
                admin: [req.user._id]
            })
            chat.save()
            res.status(200).send({ 'message': 'Chat created Successfully!', 'chat': chat })
        }
        catch (err) {
            res.status(400).send(err.message)
        }
    }
    static async createChat(req, res) {
        try {
            const chat = new Chat({
                ...req.body,
                roomName: 'Message'
            })
            await chat.save()
            res.status(200).send({ 'message': 'Chat created Successfully!', 'chat': chat })
        }
        catch (err) {
            res.status(403).send(err.message)
        }
    }


    static async accessChat(userId, user) {
        if (!userId) {
            throw Error('something went wrong!');
        }

        let isChatExist = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: userId } } },
                { users: { $elemMatch: { $eq: user } } }
            ]
        }).populate('users', '-password');

        if (isChatExist.length > 0) return { type: 'chatExist', chat: isChatExist[0] }

        try {
            const createdChat = new Chat({
                isGroupChat: false,
                admin: null,
                roomName: 'randomroom',
                users: [userId, user]
            });

            await createdChat.save();
            return createdChat;
        } catch (e) {
            console.error('Error occurred:', e);
            throw e;
        }
    }

    static async getChats(req, res) {
        try {
            const result = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
                .populate({
                    path: 'users',
                    select: "-email",
                    match: { _id: { $ne: req.user._id } }
                })
            // const result = await req.user.populate('chats')
            // const resp = await User.populate('chats')
            // console.log(result[0].users)d
            res.status(200).send(result)
        }
        catch (err) {
            res.status(400).send({ error: err.message })
        }
    }

    static async getChat(userId, chatId) {
        try {
            const result = await Chat.find({ _id: chatId })
                .populate({
                    path: 'users',
                    select: "-email",
                    match: { _id: { $ne: userId } }
                })
            return result
        }
        catch (err) {
            return err.message
        }
    }

}


module.exports = chatController