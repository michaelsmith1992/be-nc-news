const topicsRouter = require('express').Router();
const { selectTopics } = require('../controllers/topics.controller');
const incorrectMethod = require('../errors/405-error');

topicsRouter
  .route('/')
  .get(selectTopics)
  .all(incorrectMethod);

module.exports = topicsRouter;
