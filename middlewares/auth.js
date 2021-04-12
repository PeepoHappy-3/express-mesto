const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).send({ message: 'Необходима авторизация' });
  } else {
    let payload;
    const token = authorization.replace('Bearer ', '');
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      res.status(401).send({ message: err.message });
    }
    req.user = payload;
    next();
  }
};
