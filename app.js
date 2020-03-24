const express = require('express');
const cors = require('cors');
const app = express();
const apiRouter = require('./routes/api.router');
const { formatDB } = require('./db/utils/utils');
const errorHandler = require('./middleware/app-errors');

var allowedOrigins = ['http://localhost:8080'];
app.use(
  cors({
    origin: 'http://localhost:8080'
  })
);

app.use(express.json());

app.use(formatDB);

app.use('/api', apiRouter);

app.use(errorHandler);

module.exports = app;
