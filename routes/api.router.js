const apiRouter = require('express').Router();
const topicsRouter = require('./topics.router');
const usersRouter = require('./users.router');
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.router');
const { getApiRoutes, login } = require('../controllers/api.controller');
const { auth } = require('../middleware/auth');
const incorrectMethod = require('../middleware/405-error');

apiRouter.use('/topics', auth, topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

apiRouter
  .route('/')
  .get(getApiRoutes)
  .all(incorrectMethod);

apiRouter.post('/login', login);

module.exports = apiRouter;
