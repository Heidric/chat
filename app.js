const express        = require('express');
const cookieParser   = require('cookie-parser');
const db             = require('./db');
const authMiddleware = require('./middleware/auth');

const app = express();

db.sequelize.sync()
  .then(() => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static('public'));

    app.use('/auth', require('./routes/auth'));

    app.use(authMiddleware);

    require('./sockets');
  });

module.exports = app;
