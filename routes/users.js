const router = require('express').Router();
const {
  createUser, getUsers, updateUser, updateAvatar, getUser, login,
} = require('../controllers/users');

router.post('/users', createUser);
router.get('/users', getUsers);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);
router.get('/users/:userId', getUser);
router.post('/login', login);

module.exports = router;
