const express = require("express");
const app = express();
const apiRouter = require("./routes/api.router");
const { formatDB } = require("./db/utils/utils")
const errorHandler = require("./errors/app-errors");

app.use(express.json());

app.use(formatDB)

app.use("/api", apiRouter);

app.use(errorHandler);

module.exports = app;