const Card = require('../models/card');
const ObjectId = require('mongoose').Types.ObjectId;
const BadRequestError = require('../middlewares/BadRequestError');
const NotFoundError = require('../middlewares/NotFoundError');
const Unauthorized = require('../middlewares/UnauthorizedError');
const UnauthorizedError = require('../middlewares/UnauthorizedError');
const ConflictError = require('../middlewares/ConflictError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
  .then( cards => res.status(200).send( {data: cards} ))
  .catch( err => {
    next(err);
    //res.status(500).send( { message: err.message } )
  });
}

module.exports.deleteCard = async (req, res, next) => {
  try {
    if (req.params.cardId.length !== 24 || !ObjectId.isValid(req.params.cardId)) {
      next( new BadRequestError('Передан некорректный id карточки'));
      //res.status(400).send({ message: 'Передан некорректный id карточки' });
      return;
    }
    const deleteCard = await Card.findById(req.params.cardId);
    console.log(deleteCard);
    if (!deleteCard) {
      next( new BadRequestError('Карточка не найдена'));
      //res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }
    if (!deleteCard.owner.toString().includes(req.user._id)) {
      next(new NotFoundError('У вас нет прав на удаление данной карточки'));
      //res.status(404).send({ message: 'У вас нет прав на удаление данной карточки' });
      return;
    }
    await Card.findByIdAndRemove(req.params.cardId);
    res.status(200).send( {data: deleteCard} );
  } catch(err) {
    next(err);
    //res.status(500).send( {message: err.message} );
  }
}

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const newCard = await Card.create( {name: name, link: link, owner: owner} );
    res.status(200).send( {data: newCard} );
  } catch(err) {
    if (err.name === 'ValidationError') {
      next( new BadRequestError('Переданы некорректные данные'));
      //res.status(400).send({ message: 'Переданы некорректные данные ' });
      return;
    }
    next(err);
    //res.status(500).send( {message: err.message} );
  }
}

module.exports.likeCard = async (req, res, next) => {
  try {
    if (req.params.cardId.length !== 24 || !ObjectId.isValid(req.params.cardId)) {
      next( new BadRequestError('Передан некорректный id карточки'));
      //res.status(400).send({ message: 'Передан некорректный id карточки' });
      return;
    }
    const likeCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!likeCard) {
      next(new NotFoundError('Карточка не найдена'));
      //res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }
    res.status(200).send( {data: likeCard});
  } catch(err) {
    console.log(err);
    if (err.name === 'CastError') {
      next( new BadRequestError('Передан некорректный id карточки'));
      //res.status(400).send({ message: 'Передан некорректный id карточки', err });
      return;
    }
    next(err);
    //res.status(500).send( {message: err.message} );
  }
}


module.exports.dislikeCard = async (req, res, next) => {
  try {
    if (req.params.cardId.length !== 24 || !ObjectId.isValid(req.params.cardId)) {
      next( new BadRequestError('Передан некорректный id карточки'));
      //res.status(400).send({ message: 'Передан некорректный id карточки' });
      return;
    }
    const dislikeCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!dislikeCard) {
      next(new NotFoundError('Карточка не найдена'));
      //res.status(404).send({ message: 'Карточка не найдена' });
      return;
    };
    res.status(200).send( {data: dislikeCard})
  } catch(err) {
    if (err.name === 'CastError') {
      next( new BadRequestError('Передан несуществующий id карточки'));
      //res.status(400).send({ message: 'Передан несуществующий id карточки', err });
      return;
    }
    next(err);
    //res.status(500).send( {message: err.message} );
  }
}
