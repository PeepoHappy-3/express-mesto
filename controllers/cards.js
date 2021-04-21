/* eslint-disable arrow-parens */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
const Card = require('../models/card');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.validate({ name, link, owner: req.user._id }).then(() => {
    Card.create({ name, link, owner: req.user._id })
      .then((cards) => {
        cards.populate(['owner', 'likes']).execPopulate().then((card) => res.send(card)).catch(next);
      })
      .catch(next);
  }).catch(() => {
    next(new BadRequestError('Неверные данные'));
  });
};
module.exports.getCards = (req, res, next) => {
  Card.find({}).populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).populate(['owner', 'likes'])
    .then(card => {
      if (!card) {
        throw new NotFoundError('Карточки с таким id не существует');
      } else if (card.owner._id.toString() === req.user._id) {
        Card.findByIdAndRemove(card._id).then(del => {
          res.send(del);
        });
      } else throw new ForbiddenError('Нет доступа');
    }).catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверные данные'));
      } else next(err);
    });
};
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: { likes: req.user._id },
  }, { new: true })
    .then((card) => {
      card.populate(['owner', 'likes']).execPopulate().then(cards => {
        if (!cards) {
          throw new NotFoundError('Карточки с таким id не существует');
        } else res.send(cards);
      }).catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверные данные'));
      } else next(err);
    });
};
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: [req.user._id] } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточки с таким id не существует');
      } else card.populate(['owner', 'likes']).execPopulate().then(cards => res.send(cards)).catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверные данные'));
      } else next(err);
    });
};
