const client = require('../db/connection');

function getTopics() {
  return client('topics').select('*');
}

module.exports = {
  getTopics
};
