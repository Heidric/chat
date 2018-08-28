const config     = require('./config');
const Sequelize  = require('sequelize');
const db         = new Sequelize(config.database.dbName, config.database.login, config.database.password, {
  host:    config.database.host,
  dialect: 'mysql',

  define: {
    timestamps: true
  },

  pool: {
    max:     5,
    min:     0,
    acquire: 30000,
    idle:    10000
  },

  operatorsAliases: false
});

const models = new Map([
  [ 'User',        'user' ],
  [ 'ChatLog',     'chatLog' ],
  [ 'BannedUsers', 'bannedUsers' ],
]);

const modelExports = {};

models.forEach((value, key) => {
  module.exports[ key ] = db.import(`./models/${value}`);
});

module.exports.sequelize = db;
