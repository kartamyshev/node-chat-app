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

  // const li = jQuery('<li></li>');
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);
  // jQuery('#messages').append(li);

});

socket.on('newLocationMessage', function(message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const li = jQuery('<li></li>');
  const a = jQuery('<a target="_blank">My current location</a>');
  li.text(`${message.from} ${formattedTime}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
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
