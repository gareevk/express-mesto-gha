const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000, BASE_PATH} = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

//app.use('/', require('./routes/'));
app.use((req, res, next) => {
  req.user = {
    _id: '6271a992dc593a031bef16f7' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use('/users', require('./routes/users'));
app.use('/users/:id', require('./routes/users'));

app.use('/cards', require('./routes/cards'));
app.use('/cards/:id', require('./routes/cards'));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});

