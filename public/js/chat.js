//note: the styles.css was taken from links.mead.io/chat-css

//use the methods available to us in socket.io.js
//make a request from client to open up a web socket and keep it open
var socket = io();

//autoscrolling when we add a new message to the chat area if we are the bottom of the page
function scrollToBottom() {
  //selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');

  //heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

//listen for connect events from the server
//register for the "connect" event
socket.on('connect', function() {
  //now join a room
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function(err) {
    if(err){
      //display an alert
      alert(err);
      //redirect to login page
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

//listen for the disconnect event from the server
socket.on('disconnect', function() {
  console.log('Disconnected from server')
});

//listen for a new user joining the room from the server
socket.on('updateUserList', function(users) {
  var ol = jQuery('<ol></ol>');
  users.forEach(function(user) {
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
});

//listen for our custom event from server.js - we received a message
//the 2nd arg is the call back that is the data that our sever sends to us.
socket.on('newMessage', function(message) {
  //use moment library for nice time formatting
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  //use mustache to template out the formatting of our content.  It's defined in index.html
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

//listen for the generateLocationMessage event that will get emitted by the
//server when the user clicks on the locate me locationButton
socket.on('newLocationMessage', function(message) {
  //use moment library for nice time formatting
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  //use mustache to template out the content.  It's defined in index.html
  var html = Mustache.render(template, {
    createdAt: formattedTime,
    from: message.from,
    url: message.url
  });
  //now display it on the dom
  jQuery('#messages').append(html);
  scrollToBottom();
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
