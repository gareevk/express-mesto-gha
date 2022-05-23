/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../middlewares/BadRequestError');
const NotFoundError = require('../middlewares/NotFoundError');
const UnauthorizedError = require('../middlewares/UnauthorizedError');
const ConflictError = require('../middlewares/ConflictError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { _id } = req.params;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err.name);
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id пользователя'));
      }
      next(err);
    });
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const emailValidation = await User.findOne({ email });
    if (emailValidation) {
      next(new ConflictError('Такой пользоватль уже существует'));
      return;
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    const newUser = {
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    };
    res.status(201).send({ data: newUser });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    res.status(200).send({ data: updatedUser });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
    next(err);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true },
    );
    res.status(200).send({ data: updatedUser });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    res.send({ token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }) });
  } catch (err) {
    next(new UnauthorizedError('Неверный логин или пароль'));
  }
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        next(new BadRequestError('Пользователь не найден'));
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err.name);
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id пользователя'));
      }
      next(err);
    });
};
