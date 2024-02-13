const Message = require('../Model/Message')

class messageController {
    static async addMessage(chatId, messageText, id) {

        try {
            let chat = await Message.findOne({ chatId });

            if (chat) {
                // Chat exists, add new message
                chat.Messages.push({ sender: id, message: messageText });
                await chat.save();
                return chat.Messages[chat.Messages.length - 1];
            } else {
                // Chat doesn't exist, create a new one
                chat = new Message({
                    chatId,
                    Messages: [{ sender: id, message: messageText }]
                });
                await chat.save();
                return chat.Messages[0];
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    static async addVoiceMessage(chatId, audioData, id, type) {

        try {
            let chat = await Message.findOne({ chatId });

            if (chat) {
                // Chat exists, add new message
                chat.Messages.push({ sender: id, voiceMessage: { data: audioData, contentType: type } });
                await chat.save();
                return chat.Messages[chat.Messages.length - 1];
            } else {
                // Chat doesn't exist, create a new one
                chat = new Message({
                    chatId,
                    Messages: [{ sender: id, voiceMessage: { data: audioData, contentType: type } }]
                });
                await chat.save();
                return chat.Messages[0];
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    static async getMessages(req, res) {
        try {
            const { chatId } = req.params
            const messages = await Message.findOne({
                chatId
            })
            res.status(200).send(messages)
        }
        catch (err) {
            res.status(400).send(err)
        }
    }

}

module.exports = messageController