const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users.js')

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));


// socket.join('Room Name') -> joins a specific Room
// socket.leave('Room Name') -> leaves a specific Room
//
// io.emit -> message to all connected users
//
// socket.broadcast.emit -> message to all, except current user
// socket.emit -> message to one specific user
//
// io.to('Room Name').emit ->  message to all users in this Room
// socket.broadcast.to('Room Name').emit -> message all in room, except current user


io.on('connection', (socket) => {
  console.log('Dave, we have a new client connected.');


  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and Room Name are required.');

    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    // console.log(`Dave, ${user.name} has just connected.`);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));

    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined the ${params.room} Room.`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    // console.log('createMessage', message);
    let user = users.getUser(socket.id);

    if(user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    let user = users.getUser(socket.id);

    if(user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', ()=> {
    console.log(`I am sorry Dave, another client has disconnected.`);
    let user = users.removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the ${user.room} room.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Hello Dave, I am listening on port ${port}`);
});
