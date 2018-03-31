const socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('newMessage', function(message) {
  console.log('newMessage ->', message);
  const div = document.createElement('div');
  div.innerHTML = `<li>${message.from} ${message.text} ${message.createdAt}</li>`;
  document.body.appendChild(div);
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

function sendMessage() {
  socket.emit('createMessage', {
    from: 'Mike',
    text: 'Heroku'
  });
}
