/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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
  'localhost:3000',
];
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(requestLogger);
app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
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
