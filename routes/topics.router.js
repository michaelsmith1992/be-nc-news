const topicsRouter = require("express").Router();
const { selectTopics } = require("../controllers/topics.controller")

topicsRouter.get("/", selectTopics)

module.exports = topicsRouter;