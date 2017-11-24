//use the methods available to us in socket.io.js
//make a request from client to open up a web socket and keep it open
var socket = io();

//listen for connect events from the server
//register for the "connect" event
socket.on('connect', function() {
  console.log('Connected to server');

  //simulate triggering an event.
  socket.emit('createMessage', {
    from: 'mike',
    text: 'Hey this is from Mike'
  });
});

//listen for the disconnect event from the server
socket.on('disconnect', function() {
  console.log('Disconnected from server')
});

//list for our custom event from server.js
//the 2nd arg is the call back that is the data that our sever sends to us.
socket.on('newMessage', function(message) {
  console.log('newMessage', message);
});
