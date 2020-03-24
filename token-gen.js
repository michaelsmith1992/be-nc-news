const jwt = require('jsonwebtoken');
const { secret } = require('./config');

function tokenGen(username) {
  return jwt.sign({ username }, secret, {
    expiresIn: 86400 // expires in 24 hours
  });
}

module.exports = {
  tokenGen
};
