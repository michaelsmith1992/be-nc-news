const {
  selectArticle,
  selectArticles,
  updateArticle,
  insertComment,
  selectComments,
  insertArticle,
  deleteArticle,
} = require('../models/articles.models');

function getArticle(req, res, next) {
  selectArticle(req.params.article_id)
    .then((article) => {
      res.send({ article });
    })
    .catch(next);
}

function getArticles(req, res, next) {
  selectArticles(req.query)
    .then((articles) => {
      res.send(articles);
    })
    .catch(next);
}

function patchArticle(req, res, next) {
  updateArticle(req.params.article_id, req.body.inc_votes)
    .then((article) => {
      res.send({ article });
    })
    .catch(next);
}

function removeArticle(req, res, next) {
  deleteArticle(req.params.article_id)
    .then((article) => {
      res.status(204).send();
    })
    .catch(next);
}

function postComment(req, res, next) {
  insertComment(req.params.article_id, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
}

function getComments(req, res, next) {
  selectComments(req.params.article_id, req.query)
    .then((comments) => {
      res.send(comments);
    })
    .catch(next);
}

function postArticles(req, res, next) {
  insertArticle(req.body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
}

module.exports = {
  getArticle,
  patchArticle,
  postComment,
  getComments,
  getArticles,
  postArticles,
  removeArticle,
};
