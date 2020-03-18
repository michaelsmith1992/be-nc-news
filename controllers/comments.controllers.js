const { updateComment, delComment } = require('../models/comments.model');

function patchComment(req, res, next) {
  updateComment(req.params.comment_id, req.body.inc_votes)
    .then(comment => {
      res.send({ comment });
    })
    .catch(next);
}

function deleteComment(req, res, next) {
  delComment(req.params.comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
}

module.exports = { patchComment, deleteComment };
