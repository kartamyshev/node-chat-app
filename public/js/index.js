const socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('newMessage', function({ from, text, createdAt }) {
  const template = jQuery('#message-template').html();
  const formattedTime = moment(createdAt).format('h:mm a');
  const html = Mustache.render(template, {
    from, formattedTime, text
  });
  jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function({ createdAt, from, url }) {
  const template = jQuery('#location-message-template').html();
  const formattedTime = moment(createdAt).format('h:mm a');
  const html = Mustache.render(template, {
    from, formattedTime, url
  })
  jQuery('#messages').append(html);
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  const messageTextBox = jQuery('[name=message]');
  const text = messageTextBox.val();

  socket.emit('createMessage', {
    from: 'User',
    text: text
  }, function() {
    messageTextBox.val('');
  });
});


const locationButton = jQuery('#send-location');
locationButton.on('click', function(e) {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser.');
  }
  locationButton
    .attr('disabled', true)
    .text('Sending location...');

  navigator.geolocation.getCurrentPosition(function({ coords: { latitude, longitude } }) {
    locationButton
      .removeAttr('disabled')
      .text('Send location');
    socket.emit('createLocationMessage', {
      latitude, longitude
    });
  }, function(error) {
    locationButton
      .removeAttr('disabled')
      .text('Send location');
    alert('Unable to fetch location.');
  });
});
