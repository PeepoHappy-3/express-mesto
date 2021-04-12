const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [2, 'Минимум 2 символа в имени'],
    maxLength: [30, 'Максимум 30 символов в имени'],
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /^https?:\/\/(www\.)?([a-z0-9-]*\.)?([a-z0-9-]*)\.([a-z0-9-]*)(\/[\w\-._~:?#[\]@!$&'()*+,;=]*)?/gm.test(v);
      },
      message: 'Некорректная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
