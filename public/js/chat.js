const socket = io();

function scrollToBottom() {
  const messages = jQuery('#messages');
  const newMessage = messages.children('li:last-child');

  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight  >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function () {
  const params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No errors!');
    }
  });
});

socket.on('newMessage', function({ from, text, createdAt }) {
  const template = jQuery('#message-template').html();
  const formattedTime = moment(createdAt).format('h:mm a');
  const html = Mustache.render(template, {
    from, formattedTime, text
  });
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function({ createdAt, from, url }) {
  const template = jQuery('#location-message-template').html();
  const formattedTime = moment(createdAt).format('h:mm a');
  const html = Mustache.render(template, {
    from, formattedTime, url
  })
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
  const ol = jQuery('<ol></ol>');
  users.forEach(function(user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  const messageTextBox = jQuery('[name=message]');
  const text = messageTextBox.val();

  socket.emit('createMessage', {
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
