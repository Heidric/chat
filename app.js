const express      = require('express');
const cookieParser = require('cookie-parser');
const db           = require('./db');

const app = express();

db.sequelize.sync()
  .then(() => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static('public'));

    require('./sockets');

    app.use('/auth', require('./routes/auth'));
  });

module.exports = app;
