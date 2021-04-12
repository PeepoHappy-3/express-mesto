/* eslint-disable arrow-parens */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, 'Минимум 2 символа'],
    maxLength: [30, 'Максимум 30 символов'],
    default: 'Жак-Ив',
  },
  about: {
    type: String,
    minLength: [2, 'Минимум 2 символа'],
    maxLength: [30, 'Максимум 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return /^https?:\/\/(www\.)?([a-z0-9-]*\.)?([a-z0-9-]*)\.([a-z0-9-]*)(\/[\w\-._~:?#[\]@!$&'()*+,;=]*)?/gm.test(v);
      },
      message: 'Некорректная ссылка',
    },
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
    select: false,
  },
});
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
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
function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}
userSchema.methods.toJSON = toJSON;

module.exports = mongoose.model('user', userSchema);
