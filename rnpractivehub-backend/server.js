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

let onlineusers = {};
io.on('connection', socket => {
  //  / console.log('user conneced:', socket.id);

  socket.on('user_typing', data => {
    io.to(data.recieverId).emit('user_typing', data);
  });

  // socket.on('user_stop_typing', data => {
  //     io.to(data.recieverId).emit('user_stop_typing', data);
  // });

  socket.on('user_online', userId => {
    socket.join(userId);
    //  console.log('JOINED ROOM:', userId);
    //  console.log('SOCKET ID:', socket.id);

    onlineusers[userId] = socket.id;
    //console.log(`user ${userId} joined`);
    // console.log('ONLINE USERS LIST:', Object.keys(onlineusers));

    io.emit('onlineusers', Object.keys(onlineusers));
  });

  socket.on('sendmessage', async data => {
    try {
      const chat = await Chat.create(data);
      io.to(data.receiverId).emit('receivemessage', chat);
    } catch (err) {
      console.log('err in found', err);
    }
  });

  socket.on('disconnect', () => {
    for (let userId in onlineusers) {
      if (onlineusers[userId] === socket.id) {
        delete onlineusers[userId];
        break;
      }
    }

    io.emit('onlineusers', Object.keys(onlineusers));
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
