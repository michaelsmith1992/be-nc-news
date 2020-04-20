const { getUser, getAllUsers } = require('../models/users.model');

function selectUser(req, res, next) {
  getUser(req.params.username)
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
}

function allUsers(req, res, next) {
  getAllUsers()
    .then((users) => {
      res.send({ users });
    })
    .catch(next);
}

module.exports = {
  selectUser,
  allUsers,
};
