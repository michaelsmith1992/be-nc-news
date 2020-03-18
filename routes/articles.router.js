const articlesRouter = require('express').Router();
const {
  getArticle,
  getArticles,
  patchArticle,
  postComment,
  getComments
} = require('../controllers/articles.controller');

articlesRouter.get('/', getArticles);

articlesRouter
  .route('/:article_id')
  .get(getArticle)
  .patch(patchArticle);

articlesRouter
  .route('/:article_id/comments')
  .post(postComment)
  .get(getComments);

module.exports = articlesRouter;
