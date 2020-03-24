const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data/index.js');

const {
  formatDates,
  formatComments,
  makeRefObj,
  hashUserPass
} = require('../utils/utils');

exports.seed = async function(knex) {
  console.log(process.env.NODE_ENV);
  const userHashedPass = await hashUserPass(userData);
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      const topicsInsertions = knex('topics')
        .insert(topicData)
        .returning('*');
      const usersInsertions = knex('users')
        .insert(userHashedPass)
        .returning('*');
      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      let formattedData = formatDates(articleData, 'created_at');
      return knex('articles')
        .insert(formattedData)
        .returning('*');
    })
    .then(articleRows => {
      const articleRef = makeRefObj(articleRows, 'title', 'article_id');
      let formattedComments = formatComments(commentData, articleRef);
      formattedComments = formatDates(formattedComments, 'created_at');
      return knex('comments').insert(formattedComments);
    });
};
