const Card = require('../models/card');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.getCards = (req, res) => {
  Card.find({})
  .then( cards => res.status(200).send( {data: cards} ))
  .catch( err => res.status(500).send( { message: err.message } ));
}

module.exports.deleteCard = async (req, res) => {
  console.log(req.user._id);
  try {
    if (req.params.cardId.length !== 24 || !ObjectId.isValid(req.params.cardId)) {
      res.status(400).send({ message: 'Передан некорректный id карточки' });
      return;
    }
    const deleteCard = await Card.findById(req.params.cardId);
    console.log(deleteCard.owner);
    if (!deleteCard) {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }
    if (req.user._id !== deleteCard.owner) {
      res.status(404).send({ message: 'У вас нет прав на удаление данной карточки' });
      return;
    }
    await Card.findByIdAndRemove(req.params.cardId);
    res.status(200).send( {data: deleteCard} );
  } catch(err) {
    res.status(500).send( {message: err.message} );
  }
}

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const newCard = await Card.create( {name: name, link: link, owner: owner} );
    res.status(200).send( {data: newCard} );
  } catch(err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные ' });
      return;
    }
    res.status(500).send( {message: err.message} );
  }
}

module.exports.likeCard = async (req, res) => {
  try {
    if (req.params.cardId.length !== 24 || !ObjectId.isValid(req.params.cardId)) {
      res.status(400).send({ message: 'Передан некорректный id карточки' });
      return;
    }
    const likeCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!likeCard) {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }
    res.status(200).send( {data: likeCard});
  } catch(err) {
    console.log(err);
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Передан некорректный id карточки', err });
      return;
    }
    res.status(500).send( {message: err.message} );
  }
}


module.exports.dislikeCard = async (req, res) => {
  try {
    if (req.params.cardId.length !== 24 || !ObjectId.isValid(req.params.cardId)) {
      res.status(400).send({ message: 'Передан некорректный id карточки' });
      return;
    }
    const dislikeCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!dislikeCard) {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    };
    res.status(200).send( {data: dislikeCard})
  } catch(err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Передан несуществующий id карточки', err });
      return;
    }
    res.status(500).send( {message: err.message} );
  }
}
