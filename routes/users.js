const router = require('express').Router();
const {
  getUsers, updateUser, updateAvatar, getUser, getCurrentUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.patch('/users/me/avatar', updateAvatar);
router.patch('/users/me', updateUser);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', getUser);
module.exports = router;
