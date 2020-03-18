const apiRouter = require('express').Router();
const topicsRouter = require('./topics.router');
const usersRouter = require('./users.router');
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.router');
const { getApiRoutes } = require('../controllers/api.controller');
const incorrectMethod = require('../errors/405-error');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

apiRouter
  .route('/')
  .get(getApiRoutes)
  .all(incorrectMethod);

module.exports = apiRouter;
