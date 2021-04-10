/* eslint-disable arrow-parens */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Неверный адрес электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Что-то не так с почтой или паролем'));
      }
      return bcrypt.compare(password, user.password)
        .then(matched => {
          if (!matched) {
            return Promise.reject(new Error('Что-то не так с почтой или паролем'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
