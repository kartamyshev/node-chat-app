const socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('newMessage', function(message) {
  console.log('newMessage ->', message);
  const li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  const text = jQuery('[name=message]').val();

  socket.emit('createMessage', {
    from: 'User',
    text: text
  }, function() {

  });
});
