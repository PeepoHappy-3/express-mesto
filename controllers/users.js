const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Неверные данные' });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error('Такого пользователя нет');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
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
module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { name: req.body.name, about: req.body.about })
    .orFail(() => {
      const error = new Error('Такого пользователя нет');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Неверные данные' });
      } else
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar })
    .orFail(() => {
      const error = new Error('Такого пользователя нет');
      error.statusCode = 404;
      throw error;
    })
    .then((avatar) => res.send({ data: avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Неверные данные' });
      } else
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
