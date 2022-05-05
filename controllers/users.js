const User = require('../models/user');

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

module.exports.createUser = (req, res) => {
  console.log(req.body);
  const { name, about, avatar } = req.body;
  User.create( {name: name, about: about, avatar: avatar} )
  .then(user => res.status(200).send( { data: user } ))
  .catch( err => {
    console.log(err.name);
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные ' });
      return;
    }
    res.status(500).send( {message: err.message} )
  });
}

module.exports.updateUser = async (req, res) => {
  try {
    const {name, about} = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {name: name, about: about}, {new: true});
    res.status(200).send( {data: updatedUser});
  } catch(err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные ' });
      return;
    }
    res.status(500).send( { message: err.message } );
  }
}

module.exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {avatar: avatar}, {new: true});
    console.log(updatedUser);
    res.status(200).send( {data: updatedUser});
  } catch(err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные ' });
      return;
    }
    res.status(500).send( { message: err.message } );
  }
}