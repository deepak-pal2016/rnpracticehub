/* eslint-disable no-unused-vars */
const Chat = require('../models/chat');

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, messageType, mediaUrl } = req.body;
    const chat = await Chat.create({
      senderId,
      receiverId,
      message,
      messageType,
      mediaUrl,
    });
    res.status(201).json(chat);
  } catch (error) {
    console.log('getting error in message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { sendMessage };
