/* eslint-disable arrow-parens */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { BadRequestError } = require('../errors/BadRequestError');
const { ConflictError } = require('../errors/ConflictError');
const { NotFoundError } = require('../errors/NotFoundError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!password) {
    throw new BadRequestError('Пароль не может быть пустым');
  }
  User.validate({
    name, about, avatar, email, password,
  }).then(() => {
    bcrypt.hash(password, 10)
      .then((hash) => {
        User.create({
          name, about, avatar, email, password: hash,
        })
          .then((user) => {
            res.status(201).send({ data: user.toJSON() });
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequestError('Неверные данные'));
            } else if (err.code === 11000) {
              next(new ConflictError('Пользователь с таким email уже существует'));
            } else {
              next(err);
            }
          });
      });
  }).catch((err) => {
    next(new BadRequestError(err.message));
  });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователя с таким id не существует');
      } else res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверные данные'));
      } else next(err);
    });
};
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователя с таким id не существует');
      } else res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверные данные'));
      } else next(err);
    });
};
module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body,
    { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователя с таким id не существует');
      } else res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Неверные данные'));
      } else next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body,
    { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователя с таким id не существует');
      } else res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Неверные данные'));
      } else next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then(user => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: 3600000 * 24 * 7 });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
        .end();
    }).catch(err => {
      next(new UnauthorizedError(err.message));
    });
};
