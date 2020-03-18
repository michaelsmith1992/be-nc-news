const usersRouter = require("express").Router();
const { selectUser } = require("../controllers/users.controller")

usersRouter.get("/:username", selectUser)

module.exports = usersRouter;