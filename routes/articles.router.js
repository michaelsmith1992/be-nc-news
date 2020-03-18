const articlesRouter = require('express').Router();
const {
  getArticle,
  getArticles,
  patchArticle,
  postComment,
  getComments
} = require('../controllers/articles.controller');
const incorrectMethod = require('../errors/405-error');

articlesRouter
  .route('/')
  .get(getArticles)
  .all(incorrectMethod);

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticle)
  .all(incorrectMethod);

articlesRouter
  .route('/:article_id/comments')
  .post(postComment)
  .get(getComments)
  .all(incorrectMethod);

module.exports = articlesRouter;
