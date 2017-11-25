//use the methods available to us in socket.io.js
//make a request from client to open up a web socket and keep it open
var socket = io();

//listen for connect events from the server
//register for the "connect" event
socket.on('connect', function() {
  console.log('Connected to server');
});

//listen for the disconnect event from the server
socket.on('disconnect', function() {
  console.log('Disconnected from server')
});

//listen for our custom event from server.js - we received a message
//the 2nd arg is the call back that is the data that our sever sends to us.
socket.on('newMessage', function(message) {
  console.log('newMessage', message);
  //create a new element to add to the dom
  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});

//listen for submit event, has a callback
jQuery('#message-form').on('submit', function(e) {
  //override the default behavior on a form submit, which puts the submission in the URL
  //and refreshes the page - bad
  e.preventDefault();
  //send the createMessage Event that the server is listening for.  The server will handle it now.
  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function(){

  })
});
