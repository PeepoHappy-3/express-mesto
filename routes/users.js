const router = require('express').Router();
const {
  createUser, getUsers, updateUser, updateAvatar, getUser,
} = require('../controllers/users');

router.post('/users', createUser);
router.get('/users', getUsers);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);
router.get('/users/:userId', getUser);
module.exports = router;
