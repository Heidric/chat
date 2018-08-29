const redis    = require('redis');
const bluebird = require('bluebird');
const client   = redis.createClient();
const io       = require('../sockets').io;
const db       = require('../db');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

function getChatLog(req, res, next) {
  return db.chatLog.findAll({
    where: {
      channel: req.params.channel
    }
  })
    .then(async (chatLog) => {
      const socketId = await client.get(req.user.nickname);

      return io.sockets.connected[socketId].emit('chat history', chatLog);
    })
    .catch((error) => {
      console.log("Что-то пошло не так: \n", error);
      return res.status(500).json({
        message: error
      });
    });
}

async function getUsersInChannel(req, res, next) {
  if (!io.sockets.adapter.rooms[req.params.channel] || !io.sockets.adapter.rooms[req.params.channel].sockets) {
    return res.json({ message: 'В данном канале никого нет' });
  }

  const socketIds = Object.keys(io.sockets.adapter.rooms[req.params.channel].sockets);
  let users       = [];

  for (const socketId of socketIds) {
    users.push(await client.getAsync(socketId));
  }

  return res.json(users);
}

function banUser(req, res, next) {
  return db.BannedUser.create({
    nickname: req.params.nickname,
    channel:  req.params.channel
  })
    .then(async () => {
      const socketId = await client.getAsync(req.params.nickname);
      const socket   = io.sockets.connected[socketId];

      if (socket) {
        socket.leave(req.params.channel);
      }

      return res.json({ message: `Пользователь ${req.params.nickname} был успешно заблокирован` });
    })
    .catch((error) => {
      console.log("Что-то пошло не так: \n", error);
      return res.status(500).json({
        message: error
      });
    });
}

module.exports = {
  getChatLog,
  getUsersInChannel,
  banUser
};
