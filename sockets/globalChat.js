const io = require('socket.io').listen(8563);

io.on('connection', function (socket) {
  console.log('connection');
});
