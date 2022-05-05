const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
  .then( cards => res.status(200).send( {data: cards} ))
  .catch( err => res.status(500).send( { message: err.message } ));
}

module.exports.deleteCard = (req, res) => {
  console.log(req.params.id);
  const _id = req.params.id;
  console.log(_id);
  Card.findByIdAndRemove( _id)
  .then( card => res.status(200).send( {data: card} ))
  .catch( err => res.status(500).send( {message: err.message} ));
}

module.exports.createCard = (req, res) => {
  const { name, link, owner } = req.body;
  Card.create( {name: name, link: link, owner: owner} )
  .then(card => res.status(200).send( { data: card } ))
  .catch( err => {
    console.log(err.name);
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные ' });
      return;
    }
    res.status(500).send( {message: err.message} )
  });
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
  )
  .then( card => res.status(200).send( {data: card}) )
  .catch( err => res.status(500).send( {message: err.message} ));
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
  )
  .then( card => res.status(200).send( {data: card}) )
  .catch( err => res.status(500).send( {message: err.message} ));
}