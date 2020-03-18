const { getUser } = require("../models/users.model")

function selectUser(req, res, next) {
  getUser(req.params.username).then(user => {
    res.send({ user })
  }).catch(next)
}

module.exports = {
  selectUser
}