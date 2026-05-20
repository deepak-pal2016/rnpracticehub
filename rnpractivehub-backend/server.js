/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
require('dotenv').config();
const Chat = require('./src/models/chat');
const { Server } = require('socket.io');
const app = require('./src/app');
const connectDB = require('./src/config/db');
const User = require('./src/models/users');
const admin = require('./src/utils/firebase');
const server = require('http').createServer(app);
const PORT = 5000;

const io = new Server(server, {
  cors: { origin: '*' },
});

let onlineusers = {};
app.set('onlineusers', onlineusers);
io.on('connection', socket => {
  // console.log('user conneced:', socket.id);

  socket.on('user_typing', data => {
    io.to(data.recieverId).emit('user_typing', data);
  });

  socket.on('offer', data => {
    io.to(data?.receiverId).emit('offer', data);
  });

  socket.on('answer', data => {
    // console.log('answer', data);

    io.to(data?.receiverId).emit('answer', data);
  });

  socket.on('call_accepted', data => {
    // console.log('CALL ACCEPTED =>', data);
    const callerSocketId = onlineusers[data.callerId];

    // console.log('caller socket =>', callerSocketId);

    if (callerSocketId) {
      io.to(callerSocketId).emit('call_accepted');
    }
  });

  socket.on('video_call', data => {
    // console.log('video call request', data);
    io.to(data?.receiverId).emit('incoming_video_call', data);
  });

  socket.on('ice_candidate', data => {
    // console.log('ICE =>', data.receiverId);
    io.to(data?.receiverId).emit('ice_candidate', data);
  });

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
      const receiverSocketId = onlineusers[data.receiverId];
      if (!receiverSocketId) {
        const user = await User.findById(data.receiverId);
        const senderuser = await User.findById(data.senderId);
        if (user?.fcmtoken) {
          try {
            const payload = {
              token: user.fcmtoken,
              data: {
                title: 'You have a new message',
                body:
                  data?.message?.length > 70
                    ? `${data.message.slice(0, 70)}...`
                    : data?.message || 'Audio message',
                senderId: String(data?.senderId || ''),
                receiverId: String(data?.receiverId || ''),
                type: 'chat',
                screen: 'Userchat',
                _id: String(senderuser?._id || ''),
                name: senderuser?.name || '',
              },
              android: {
                priority: 'high',
              },
            };
            const response = await admin.messaging().send(payload);
          } catch (error) {
            console.log('FCM Send Error:', error);
          }
        }
      }
    } catch (err) {
      console.log(err, 'FCM ERROR');
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
