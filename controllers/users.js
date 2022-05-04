const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
  .then( users => res.send( {data: users} ))
  .catch( err => res.status(500).send( { message: err.message } ));
}

module.exports.getUserById = (req, res) => {
  const { _id } = req.params;
  User.findById( _id)
  .then( user => res.send( {data: user} ))
  .catch( err => res.status(500).send( {message: err.message} ));
}

module.exports.createUser = (req, res) => {
  console.log(req.body);
  const { name, about, avatar } = req.body;

  console.log(name);

  User.create( {name: name, about: about, avatar: avatar} )
  .then(user => res.send( { data: user } ))
  .catch( err => res.status(500).send( {message: err.message} ));
}