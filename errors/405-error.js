function incorrectMethod(req, res, next) {
  res.status(405).send({ msg: 'incorrect method on url' });
}

module.exports = incorrectMethod;
