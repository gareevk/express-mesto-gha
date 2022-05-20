const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUsers, createUser, getUserById, updateUser, updateAvatar, getCurrentUser } = require('../controllers/users');

router.get('/users', getUsers);
//router.post('/users', createUser);
router.get('/users/me', getCurrentUser);
router.get('/users/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24)
  })
}), getUserById);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30)
  })
}),updateUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(http|https):\/\/(www\.)?[-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/i)
  })
}),updateAvatar);


module.exports = router;