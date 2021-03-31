/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const { PORT = 3000 } = process.env;

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
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`${PORT} Port listening`);
});
