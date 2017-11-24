const http = require('http'); //build in module
const path = require('path'); //built in module

const socketIO = require('socket.io');
const express = require('express');
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

//configure middleware to set up the directory for all our public files
app.use(express.static(publicPath));

//io.on() registers an event listener
//listen for a new connection
io.on('connection', (socket) => {
  console.log('New user connected');

  //socket.emit triggers our custom event to the individual socket (connection),
  //2nd arg is anything we want. Typcially it is an object
  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app',
    createdAt: new Date().getTime()
  });

  //socket.broadcast.emit will broadcast message to everyone but the individual socket
  //that made the connection
  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createdAt: new Date().getTime()
  });

  //listen for an event that the client has created.
  //call back will contain the contents of this new message object
  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
    //when we receive a message, send it out to all of our connections using io.emit
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  })

  //listen for a closed connection on the socket connection (i.e browser closes)
  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});

server.listen(port, () => console.log(`Server is up on port ${port}`));
