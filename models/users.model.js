const client = require("../db/connection")

function getUser(username) {
  return client("users").select("*").where({ username: username }).then(result => {
    if (!result.length) return Promise.reject({ status: 404, msg: "User not found!" })
    return result[0]
  })
}

module.exports = {
  getUser
}