const usersRouter = require('express').Router();
const { selectUser } = require('../controllers/users.controller');
const incorrectMethod = require('../errors/405-error');

usersRouter
  .route('/:username')
  .get(selectUser)
  .all(incorrectMethod);

module.exports = usersRouter;
