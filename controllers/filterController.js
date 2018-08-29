const db = require('../db');
const filteredWords = require('../app').filteredWords;

function getAllWords(req, res, next) {
  return db.FilteredWord.findAll()
    .then((words) => {
      return res.json({ words });
    })
    .catch((error) => {
      console.log("Что-то пошло не так: \n", error);
      return res.status(500).json({
        message: error
      });
    });
}

async function addWord(req, res, next) {
  const count = await db.FilteredWord.count({
    where: {
      word: req.body.word
    }
  });

  if (count > 0) {
    return res.status(400).json({ message: 'Данное слово уже находится в списке для фильтрации' });
  }

  return db.FilteredWord.create({
    word: req.body.word
  })
    .then(() => {
      filteredWords.push(req.body.word);
      return res.json({ message: 'Слово для фильтрации успешно добавлено' });
    })
    .catch((error) => {
      console.log("Что-то пошло не так: \n", error);
      return res.status(500).json({
        message: error
      });
    });
}

async function removeWord(req, res, next) {
  const count = await db.FilteredWord.count({
    where: {
      word: req.body.word
    }
  });

  if (count === 0) {
    return res.status(400).json({ message: 'Данное слово отсутствует в списке для фильтрации' });
  }

  return db.FilteredWord.remove({
    where: {
      word: req.body.word
    }
  })
    .then(() => {
      if (filteredWords.indexOf(req.body.word) !== -1) {
        filteredWords.splice(filteredWords.indexOf(req.body.word), 1);
      }
      return res.json({ message: 'Слово для фильтрации успешно удалено' });
    })
    .catch((error) => {
      console.log("Что-то пошло не так: \n", error);
      return res.status(500).json({
        message: error
      });
    });
}

module.exports = {
  getAllWords,
  addWord,
  removeWord
};
