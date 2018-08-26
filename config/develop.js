module.exports = {
  database:    {
    dbName:   'chat',
    login:    'root',
    password: process.env.DB_PASS || '0000',
    host:     'localhost'
  },
  secret: 'supersecret'
};
