const express = require('express');
const cors = require('cors');
const app = express();
const apiRouter = require('./routes/api.router');
const { formatDB } = require('./db/utils/utils');
const errorHandler = require('./middleware/app-errors');

const whitelist = [
  'http://localhost:8080',
  'http://localhost:3000',
  'https://msmith-vue-news-fe.herokuapp.com',
];
const corsOptions =
  process.env.NODE_ENV === 'production'
    ? {
        origin: function (origin, callback) {
          if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
      }
    : {};

app.use(cors());

app.use(express.json());

app.use(formatDB);

app.use('/api', apiRouter);

app.use(errorHandler);

module.exports = app;
