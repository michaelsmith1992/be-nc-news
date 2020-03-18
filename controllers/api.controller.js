const { readEndPoints } = require('../models/api.model');

async function getApiRoutes(req, res, next) {
  try {
    const api = await readEndPoints();
    res.send({ api });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getApiRoutes
};
