//note: the styles.css was taken from links.mead.io/chat-css

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
  var formattedTime = moment(message.createdAt).format('h:mm a');
  //create a new element to add to the dom
  var li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);
  jQuery('#messages').append(li);
});

//listen for the generateLocationMessage event that will get emitted by the server when the user clicks on the locate me locationButton
socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  //open the link in a new tab by using target="_blank"
  var a = jQuery('<a target="_blank">My current location</a>')

  li.text(`${message.from} ${formattedTime}: `);
  //set the href attribute on the a tag. (if you pass in on arg, it will return the attribute)
  a.attr('href', message.url);
  li.append(a); //add this url to our li target
  //now display it on the dom
  jQuery('#messages').append(li);
});

//listen for submit event, has a callback
jQuery('#message-form').on('submit', function(e) {
  //override the default behavior on a form submit, which puts the submission in the URL
  //and refreshes the page - bad
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  //send the createMessage Event that the server is listening for.  The server will handle it now.
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function(){
    //clear the message after it is sent
    messageTextbox.val('');
  });
});

//the send-location button
var locationButton = jQuery('#send-location');
//jQuery('#send-location').on();
locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser.');
  }
  //after they click the button, make it disabled until it is done.
  locationButton.attr('disabled', 'disabled').text('Sending location...');
  //built in geolocator that we can use to get our position in the world
  //takes 2 args, success function and failure function.
  navigator.geolocation.getCurrentPosition(function(position){
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  },function(){
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
