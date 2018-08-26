const db     = require('../db');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const config = require('../config');

function register(req, res, next) {
  const nickname    = req.body.nickname;
  const rawPassword = req.body.password;

  return db.User.count({
    where: {
      nickname
    }
  })
    .then((count) => {
      if (count > 0) {
        return res.status(400).json({ message: 'Пользователь с таким никнеймом уже существует' });
      }

      const userDoc = {
        nickname,
        password: bcrypt.hashSync(rawPassword, 10)
      };

      return db.User.create(userDoc)
    })
    .then((user) => {
      return res.json({ message: 'Регистрация прошла успешно' });
    })
    .catch((error) => {
      console.log("Что-то пошло не так: \n", error);
      return res.status(500).json({
        message: error
      });
    });
}

function login(req, res, next) {
  const nickname    = req.body.nickname;
  const rawPassword = req.body.password;

  return db.User.findOne({
    where: {
      nickname
    }
  })
    .then(async (user) => {
      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      const correct = await bcrypt.compare(rawPassword, user.password);

      if (correct) {
        return res.json({
          token:   jwt.sign({
            nickname: user.nickname,
            id:       user.id
          }, config.secret),
          message: 'Аутентикация выполнена успешно'
        });
      } else {
        return res.status(400).json({
          message: 'Неверный пароль'
        });
      }
    })
    .catch((error) => {
      console.log("Что-то пошло не так: \n", error);
      return res.status(500).json({
        message: error
      });
    });
}

module.exports = {
  register,
  login
};
