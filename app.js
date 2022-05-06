const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6271a992dc593a031bef16f7'
  };

  next();
});

app.use(express.json());
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

/*
app.use('/users', require('./routes/users'));
app.use('/users/:id', require('./routes/users'));
app.use('/users/me', require('./routes/users'));
app.use('/cards/me/avatar', require('./routes/users'));

app.use('/cards', require('./routes/cards'));
app.use('/cards/:id', require('./routes/cards'));
app.use('/cards/:cardId/likes', require('./routes/cards'));
*/

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
});

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
});

