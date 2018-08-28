const io     = require('socket.io').listen(8563);
const redis  = require('redis');
const db     = require('../db');
const client = redis.createClient();
const jwt    = require('jsonwebtoken');
const config = require('../config');

io.use(function(socket, next){
  if (socket.handshake.query && socket.handshake.query.token){
    jwt.verify(socket.handshake.query.token, config.secret, function(err, result) {
      if(err) return next(new Error('Требуется авторизация'));
      socket.user = result;
      next();
    });
  } else {
    next(new Error('Требуется авторизация'));
  }
}).on('connection', function (socket) {
  socket.on('join', async (channel) => {
    const nickname = socket.user.nickname;

    if (!channel) {
      return socket.disconnect();
    }

    const banned = await db.BannedUsers.count({
      where: {
        nickname,
        channel
      }
    });

    if (banned > 0) {
      return io.to(`${socket.id}`).emit('error', 'Вы заблокированы на данном канале');
    }

    socket.join(channel);

    io.to(channel).emit('message', `${nickname} joined ${channel}`);

    client.set(socket.id, nickname);
    return client.set(nickname, socket.id);
  });

  socket.on('send message', async (data) => {
    if (!io.sockets.adapter.rooms[data.channel] || Object.keys(io.sockets.adapter.rooms[data.channel].sockets).indexOf(socket.id) === -1) {
      return io.to(`${socket.id}`).emit('error', 'Чтобы написать в канал, зайдите в него');
    }

    await db.ChatLog.create({
      nickname: socket.user.nickname,
      channel:  data.channel,
      message:  data.message
    });
    io.to(data.channel).emit('message', data.message);
  });
});

module.exports = {
  io
};
