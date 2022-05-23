/* eslint-disable linebreak-style */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-destructuring */
const ObjectId = require('mongoose').Types.ObjectId;
const Card = require('../models/card');
const BadRequestError = require('../middlewares/BadRequestError');
const NotFoundError = require('../middlewares/NotFoundError');
const ForbiddenError = require('../middlewares/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    if (req.params.cardId.length !== 24 || !ObjectId.isValid(req.params.cardId)) {
      next(new BadRequestError('Передан некорректный id карточки'));
      return;
    }
    const deleteCard = await Card.findById(req.params.cardId);
    if (!deleteCard) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    if (!deleteCard.owner.toString().includes(req.user._id)) {
      next(new ForbiddenError('У вас нет прав на удаление данной карточки'));
      return;
    }
    await Card.findByIdAndRemove(req.params.cardId);
    res.status(200).send({ data: deleteCard });
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const newCard = await Card.create({
      name: name,
      link: link,
      owner: owner,
    });
    res.status(200).send({ data: newCard });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      return;
    }
    next(err);
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    if (req.params.cardId.length !== 24 || !ObjectId.isValid(req.params.cardId)) {
      next(new BadRequestError('Передан некорректный id карточки'));
      return;
    }
    const likeCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!likeCard) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    res.status(200).send({ data: likeCard });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id карточки'));
      return;
    }
    next(err);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    if (req.params.cardId.length !== 24 || !ObjectId.isValid(req.params.cardId)) {
      next(new BadRequestError('Передан некорректный id карточки'));
      return;
    }
    const dislikeCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!dislikeCard) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    res.status(200).send({ data: dislikeCard });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан несуществующий id карточки'));
      return;
    }
    next(err);
  }
};
