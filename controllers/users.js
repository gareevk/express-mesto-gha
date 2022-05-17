const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports.getUsers = (req, res) => {
  User.find({})
  .then( users => res.status(200).send( {data: users} ))
  .catch( err => res.status(500).send( { message: err.message } ));
}

module.exports.getUserById = (req, res) => {
  const { _id } = req.params;
  User.findById( _id)
  .then( user => {
    if (user === null) {
      res.status(404).send({ message: 'Пользователь не найден' });
      return;
    }
    res.status(200).send( {data: user} )
  })
  .catch( err => {
    console.log(err.name);
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Передан некорректный id пользователя' });
      return;
    }
    res.status(500).send( {message: err.message} )
  });
}

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar, email } = req.body;
    const password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create( {
      name: name,
      about: about,
      avatar: avatar,
      email: email,
      password: password
    } )
    res.status(200).send( { data: user } );
  } catch (err) {
    console.log(err.name);
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(500).send( {message: err.message} );
    }
}

module.exports.updateUser = async (req, res) => {
  try {
    const {name, about} = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {name: name, about: about}, {new: true, runValidators: true});
    res.status(200).send( {data: updatedUser});
  } catch(err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(500).send( { message: err.message } );
  }
}

module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {avatar: avatar}, {new: true});
    res.status(200).send( {data: updatedUser});
  } catch(err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(500).send( { message: err.message } );
  }
}