const fs = require('fs').promises;
const client = require('../db/connection');
const bcrypt = require('bcrypt');
const { tokenGen } = require('../token-gen');

async function readEndPoints() {
  const endPoints = await fs.readFile('./endpoints.json', 'utf8');
  return JSON.parse(endPoints);
}

async function getUserToken({ username, password }) {
  const user = await client('users')
    .select('*')
    .where({ username });
  const check = await bcrypt.compare(password, user[0].password);
  if (check) {
    return {
      token: tokenGen(username),
      user: {
        username: user[0].username,
        avatar_url: user[0].avatar_url,
        name: user[0].name
      }
    };
  } else {
    throw new Error({ status: 403, msg: 'Incorrect Password!' });
  }
}

module.exports = {
  readEndPoints,
  getUserToken
};
