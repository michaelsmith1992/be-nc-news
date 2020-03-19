const client = require('../db/connection');

function getTopics(topic) {
  return client('topics')
    .select('*')
    .modify(qb => {
      if (topic) qb.where({ slug: topic });
    });
}

module.exports = {
  getTopics
};
