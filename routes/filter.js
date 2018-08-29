const router     = require('express').Router();
const controller = require('../controllers/filterController');

router
  .get('/list',          controller.getAllWords)
  .post('/add',    controller.addWord)
  .post('/remove', controller.removeWord);

module.exports = router;
