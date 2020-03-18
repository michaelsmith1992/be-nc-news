const client = require('../db/connection');

function updateComment(comment_id, votes) {
  return client('comments')
    .increment({ votes })
    .where({ comment_id })
    .returning('*')
    .then(result => {
      console.log(result);
      if (!result.length)
        return Promise.reject({ status: 404, msg: 'Comment not found!' });
      return result[0];
    });
}

function delComment(comment_id) {
  return client('comments')
    .where({ comment_id })
    .del()
    .then(result => {
      if (result === 0)
        return Promise.reject({ msg: 'Comment not found!', status: 404 });
      return result;
    });
}

module.exports = {
  updateComment,
  delComment
};
