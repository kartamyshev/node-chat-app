const socket = io();

socket.on('connect', function () {
  console.log('Connected to server');

  socket.emit('createMessage', {
    from: 'alla@gmail.com',
    text: 'Hey. This is Alla. Everything seems to work great!'
  });
});

socket.on('newMessage', function(message) {
  console.log('newMessage ->', message);
});



socket.on('disconnect', function () {
  console.log('Disconnected from server');
});
