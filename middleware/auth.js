const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const bcrypt = require('bcrypt');

function auth(req, res, next) {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(403).send({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
}

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

module.exports = {
  auth,
  hashPassword
};
