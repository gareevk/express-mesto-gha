const router = require('express').Router();

const { getCards, createCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:id', deleteCard);
router.post('/', createCard);
router.put('/:cardId/like', likeCard);
router.delete('/:cardId/like', dislikeCard);

module.exports = router;
