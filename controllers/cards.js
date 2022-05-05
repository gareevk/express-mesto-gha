const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
  .then( cards => res.send( {data: cards} ))
  .catch( err => res.status(500).send( { message: err.message } ));
}

module.exports.deleteCard = (req, res) => {
  console.log(req.params.id);
  const _id = req.params.id;
  console.log(_id);
  Card.findByIdAndRemove( _id)
  .then( card => res.send( {data: card} ))
  .catch( err => res.status(500).send( {message: err.message} ));
}

module.exports.createCard = (req, res) => {
  console.log(req.body);
  const { name, link, owner } = req.body;

  console.log(name, link, owner);

  Card.create( {name: name, link: link, owner: owner} )
  .then(card => res.send( { data: card } ))
  .catch( err => res.status(500).send( {message: err.message} ));
}