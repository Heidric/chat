const router     = require('express').Router();
const controller = require('../controllers/chatController');
const isAllowed  = require('../middleware/isAllowed');

router
  .get('/log/:channel', isAllowed, controller.getChatLog)
  .get('/users-in/:channel', controller.getUsersInChannel)
  .post('/ban/:nickname/in/:channel', controller.banUser);

module.exports = router;
