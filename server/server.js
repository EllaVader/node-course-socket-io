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
//heroku will change the port based on on the PORT env variable
const port = process.env.PORT || 3000; //if PORT doesn't exist, default to port 3000
//create new express app
var app = express();
//pass in the express app since it has all we need for http.createServer
var server = http.createServer(app);
var io = socketIO(server); //websocket server to commuicate between client and server
//configure middleware to set up the directory for all our public files
app.use(express.static(publicPath));

//register an event listener
//listen for a new connection
io.on('connection', (socket) => {
  console.log('New user connected');
  //listen for an closed connection on the socket connection
  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});


server.listen(port, () => console.log(`Server is up on port ${port}`));
