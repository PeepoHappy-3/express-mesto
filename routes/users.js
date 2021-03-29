const router = require('express').Router();
const { createUser, getUsers } = require('../controllers/users');

router.post('/users', createUser);
router.get('/users', getUsers);
module.exports = router;
