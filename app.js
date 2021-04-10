/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

const { PORT = 3000, JWT_SECRET } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6061fc6ff57d6d41fc97a563',
  };
  next();
});
app.use(cookieParser());
app.get('/', (req, res) => {
  console.log(req.cookies.jwt);
});
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`${PORT} Port listening`);
});
