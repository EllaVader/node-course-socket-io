const http = require('http'); //build in module
const path = require('path'); //built in module

const socketIO = require('socket.io');
const express = require('express');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

/*
To use socketIO, we have to use http directly rather than express.
Express uses http for us, but we need to configure http to use socketIO
*/

//path.join is a cleaner way to deal with moving around folders within your app
const publicPath = path.join(__dirname, '../public');

//process.env stores all of our environment variables
//heroku uses this & this line will change the port based on on the PORT env variable
const port = process.env.PORT || 3000; //if PORT doesn't exist, default to port 3000

//create new express app
var app = express();
//pass in the express app to http create since since it has all we need for http.createServer
var server = http.createServer(app);
//tell websocket server to commuicate between client and server
var io = socketIO(server);
var users = new Users();

//configure middleware to set up the directory for all our public files
app.use(express.static(publicPath));

//io.on() registers an event listener
//listen for a new connection
io.on('connection', (socket) => {
  console.log('New user connected');



  //1st arg is the event we are registered to, 2nd arg contains callback, which has the contents of the
  //event, and also it has a callback that we need to call when we are done working with the params
  socket.on('join', (params, callback) => {

    //validate the data that come through (name and room)- make sure they are valued not empty string
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and room name are required');
    }

    //now "join" this specific room (socket)
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    //broadcast to the specific room that a new user has joined
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    //socket.leave(params.room); //leave a room (socket)

    //socket.emit triggers our custom event to the individual socket (connection),
    //2nd arg is anything we want. Typcially it is an object
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    //socket.broadcast.emit will broadcast message to everyone but the individual socket
    //that made the connection
    //socket.broadcast.to('room').emit will broadcast to everyone in that specific room
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

    callback();
  });

  //listen for an event that the client has created.
  //call back will contain the contents of this new message object
  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    //when we receive a message, send it out to all of our connections using io.emit
    io.emit('newMessage', generateMessage(message.from, message.text));
    //now make a call to the callback (the client's callback)
    callback();
  })

  //listen for a new event from the client called createLocationMessage
  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  //listen for a closed connection on the socket connection (i.e browser closes)
  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if(user){
      //update the user list on the page
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      //broadcast that a user just left the chatroom
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});

server.listen(port, () => console.log(`Server is up on port ${port}`));
