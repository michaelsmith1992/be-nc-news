const usersRouter = require('express').Router();
const { selectUser, allUsers } = require('../controllers/users.controller');
const incorrectMethod = require('../middleware/405-error');

usersRouter.route('/:username').get(selectUser).all(incorrectMethod);

usersRouter.route('/').get(allUsers).all(incorrectMethod);

module.exports = usersRouter;
