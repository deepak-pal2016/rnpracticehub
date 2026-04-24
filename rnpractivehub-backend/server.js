/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
require('dotenv').config();
const Chat = require('./src/models/chat');
const { Server } = require('socket.io');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const server = require('http').createServer(app);
const PORT = 5000;

const io = new Server(server, {
  cors: { origin: '*' },
});

let onlineusers = {}
io.on('connection', socket => {
  console.log('user conneced:', socket.id);

  socket.on('join', userId => {
    socket.join(userId);
    console.log(`user ${userId} joined`);
  });

  socket.on('join',(userId) => {
     onlineusers[userId] = socket.id
     io.emit('onlineusers',Object.keys(onlineusers))
  })

  
  socket.on('sendmessage', async data => {
    try {
      const chat = await Chat.create(data);
      // reciever ko messge bhejna
      io.to(data.receiverId).emit('receivemessage', chat);
    } catch (err) {
      console.log('err in found', err);
    }
  });
  // disconenect socket 
  socket.on('disconnect', () => {
    console.log('user disconnected',socket.id);
    for(let userId in onlineusers){
      if(onlineusers[userId] === socket.id){
        delete onlineusers[userId]
      }
    }
    io.emit('onlineusers',Object.keys(onlineusers))
  });
});

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log('DB connection failed', err);
  });
