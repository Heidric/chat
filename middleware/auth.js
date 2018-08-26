const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.autorization.split(' ')[ 0 ] === 'JWT') {
    return jwt.verify(req.headers.autorization.split(' ')[ 1 ], config.secret, (err, result) => {
      if (err) {
        return res.status(401).json({ message: 'Требуется авторизация' });
      }
      req.user = result;
      next();
    });
  } else {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }
};
