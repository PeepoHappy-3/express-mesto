/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { validateUserLogin, validateUserCreate, validateAuthorize } = require('./middlewares/validations');
const { NotFoundError } = require('./errors/NotFoundError');

const app = express();

const { PORT = 3000 } = process.env;

const allowedCors = [
  'https://mesto-praktikum.nomoredomains.monster',
  'http://mesto-praktikum.nomoredomains.monster/',
  'http://localhost:3000',
];
const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
};
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(requestLogger);
app.use(cors(corsOptions));
app.post('/signin', validateUserLogin, login);
app.post('/signup', validateUserCreate, createUser);
app.use(cookieParser());
app.use(validateAuthorize, auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (req, res) => {
  throw new NotFoundError('Страница не найдена');
});
app.use(errors());
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка сервера' : message });
});

app.listen(PORT, () => {
  console.log(`${PORT} Port listening`);
});
