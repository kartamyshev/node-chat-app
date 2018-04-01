const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const users = new Users();

app.use(express.static(publicPath));



io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('admin', 'Welcome to the chat app!'))
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('admin', `${params.name} has joined!`))
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage ->', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', ({ latitude, longitude }) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', latitude, longitude));
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('admin', `User ${user.name} has left.`));
    }
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
