const router = require('express').Router();
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const {
  validateCreateCard, validateDeleteCard, validatePutLike, validateDeleteLike,
} = require('../middlewares/validations');

router.post('/cards', validateCreateCard, createCard);
router.get('/cards', getCards);
router.delete('/cards/:cardId', validateDeleteCard, deleteCard);
router.put('/cards/:cardId/likes', validatePutLike, likeCard);
router.delete('/cards/:cardId/likes', validateDeleteLike, dislikeCard);
module.exports = router;
