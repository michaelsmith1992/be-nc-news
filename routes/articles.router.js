const articlesRouter = require('express').Router();
const {
  getArticle,
  getArticles,
  postArticles,
  patchArticle,
  postComment,
  getComments,
  removeArticle,
} = require('../controllers/articles.controller');
const incorrectMethod = require('../middleware/405-error');

articlesRouter
  .route('/')
  .get(getArticles)
  .post(postArticles)
  .all(incorrectMethod);

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticle)
  .delete(removeArticle)

  .all(incorrectMethod);

articlesRouter
  .route('/:article_id/comments')
  .post(postComment)
  .get(getComments)
  .all(incorrectMethod);

module.exports = articlesRouter;
