const router = require('express').Router();
const {
  getUsers, updateUser, updateAvatar, getUser, getCurrentUser,
} = require('../controllers/users');

const { validateUpdateUser, validateUpdateAvatar, validateGetUser } = require('../middlewares/validations');

router.get('/users', getUsers);
router.patch('/users/me/avatar', validateUpdateAvatar, updateAvatar);
router.patch('/users/me', validateUpdateUser, updateUser);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', validateGetUser, getUser);

module.exports = router;
