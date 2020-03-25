const { readEndPoints, getUserToken } = require('../models/api.model');

async function getApiRoutes(req, res, next) {
  try {
    const api = await readEndPoints();
    res.send({ api });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const user = await getUserToken(req.body);
    res.send(user);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {}

async function register(req, res, next) {}

module.exports = {
  getApiRoutes,
  login,
  logout,
  register
};
