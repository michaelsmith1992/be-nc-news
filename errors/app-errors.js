function errorHandler(err, req, res, next) {
  const psqlError = {
    '22P02': {
      status: 400,
      msg: 'Incorrect information in body'
    },
    '23503': {
      status: 404,
      msg: 'Not found!'
    },
    '23502': {
      status: 400,
      msg: 'Incorrect Information in body'
    },
    '42703': {
      status: 400,
      msg: 'Invalid query value in url'
    }
  };
  if (psqlError[err.code]) {
    return res
      .status(psqlError[err.code].status)
      .send({ msg: psqlError[err.code].msg });
  }
  if (err.status) return res.status(err.status).send({ msg: err.msg });
  res.status(500).send();
}

module.exports = errorHandler;
