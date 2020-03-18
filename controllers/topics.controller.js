const { getTopics } = require("../models/topics.models")

function selectTopics(req, res, next) {
  getTopics().then(topics => {
    res.send({ topics })
  }).catch(next)
}

module.exports = {
  selectTopics
}