const config = require('../config');
const db     = require('../db');

module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  return db.BannedUser.count({
    where: {
      nickname: req.user.nickname,
      channel:  req.params.channel || req.body.channel
    }
  })
    .then((banned) => {
      if (banned > 0) {
        return res.status(401).json({ message: 'Вы забанены на данном канале' });
      } else {
        return next();
      }
    })
    .catch((error) => {
      console.log("Что-то пошло не так: \n", error);
      return res.status(500).json({
        message: error
      });
    });
};
