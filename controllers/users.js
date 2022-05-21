const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const BadRequestError = require('../middlewares/BadRequestError');
const NotFoundError = require('../middlewares/NotFoundError');
const Unauthorized = require('../middlewares/UnauthorizedError');
const UnauthorizedError = require('../middlewares/UnauthorizedError');
const ConflictError = require('../middlewares/ConflictError');

module.exports.getUsers = (req, res) => {
  User.find({})
  .then( users => res.status(200).send( {data: users} ))
  .catch( err => res.status(500).send( { message: err.message } ));
}

module.exports.getUserById = (req, res, next) => {
  const { _id } = req.params;
  console.log(_id);
  User.findById( _id)
  .then( user => {
    console.log('тут' + user);
    if (!user) {
      next(new NotFoundError('Пользователь не найден'));
      //res.status(404).send({ message: 'Пользователь не найден' });
      //return;
    }
    res.status(200).send( {data: user} )
  })
  .catch(err => {
    console.log(err.name);
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id пользователя'));
    }
    next(err);
  });
  /*
  .catch( err => {
    console.log(err.name);
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Передан некорректный id пользователя' });
      return;
    }
    res.status(500).send( {message: err.message} )
  });
  */
}

module.exports.createUser = (req, res, next) => {
  console.log(req.body);
  const { name, about, avatar, email, password } = req.body;
  const emailValidation = User.findOne({email});
  if (emailValidation) {
    next( new ConflictError('Такой пользоватль уже существует'));
    return;
  }
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name: name,
      about: about,
      avatar: avatar,
      email: email,
      password: hash,
    }))
    .then((user) => {
      console.log(user);
      const newUser = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id
      }
      res.status(201).send({data:newUser});
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        //res.status(400).send({ message: 'Переданы некорректные данные' });
        //return;
      }
      //res.status(500).send( {message: err.message} );
      next(err);
    });
  /*
  try {
    const { name, about, avatar, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    console.log(hash);
    const user = await User.create( {
      name: name,
      about: about,
      avatar: avatar,
      email: email,
      password: hash
    }, {new: true, runValidators: true} );
    console.log(user);
    res.status(200).send( { data: user } );
    } catch (err) {
    console.log(err.message);
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(500).send( {message: err.message} );
    }
    */
}

module.exports.updateUser = async (req, res, next) => {
  try {
    const {name, about} = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {name: name, about: about}, {new: true, runValidators: true});
    res.status(200).send( {data: updatedUser});
  } catch(err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      //res.status(400).send({ message: 'Переданы некорректные данные' });
      //return;
    }
    //res.status(500).send( { message: err.message } );
    next(err);
  }
}

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {avatar: avatar}, {new: true});
    res.status(200).send( {data: updatedUser});
  } catch(err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные'));
      //res.status(400).send({ message: 'Переданы некорректные данные' });
      //return;
    }
    //res.status(500).send( { message: err.message } );
    next(err);
  }
}

module.exports.login = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    const user =  await User.findUserByCredentials(email, password);
    console.log(user);
    res.send({token: jwt.sign({ _id: user._id }, 'super-strong-secret', {expiresIn: '7d'})});
  } catch (err) {
    //res.status(401).send({ message: err.message });
    next(new UnauthorizedError('Неверный логин или пароль'));
  }
    /*
    res.status(200).cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true
    })
    */
}

module.exports.getCurrentUser = (req, res, next) => {
  const _id = req.user._id;
  User.findById( _id)
  .then( user => {
    if (user === null) {
      next( new BadRequestError('Пользователь не найден'));
      //res.status(404).send({ message: 'Пользователь не найден' });
      //return;
    }
    res.status(200).send( {data: user} )
  })
  .catch( err => {
    console.log(err.name);
    if (err.name === 'CastError') {
      next(new BadRequestError('Передан некорректный id пользователя'));
      //res.status(400).send({ message: 'Передан некорректный id пользователя' });
      //return;
    }
    //res.status(500).send( {message: err.message} )
    next(err);
  });

}