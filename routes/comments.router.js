const commentsRouter = require('express').Router();
const {
  patchComment,
  deleteComment
} = require('../controllers/comments.controllers');
const incorrectMethod = require('../middleware/405-error');

commentsRouter
  .route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment)
  .all(incorrectMethod);

module.exports = commentsRouter;
