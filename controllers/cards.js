/* eslint-disable no-unused-vars */
const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Неверные данные' });
      } else res.status(500).send({ message: err.message });
    });
};
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error('Такой карточки нет');
      error.statusCode = 404;
      throw error;
    })
    .then(() => {
      res.send({ message: 'Пост удален' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неверные данные' });
      } else
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      const error = new Error('Такой карточки нет');
      error.statusCode = 404;
      throw error;
    })
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неверные данные' });
      } else
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      const error = new Error('Такой карточки нет');
      error.statusCode = 404;
      throw error;
    })
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Неверные данные' });
      } else
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
