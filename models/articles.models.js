const client = require('../db/connection');

function selectArticle(article_id) {
  return client('articles')
    .select(
      'articles.article_id',
      'articles.title',
      'articles.body',
      'articles.author',
      'articles.created_at',
      'articles.topic',
      'articles.votes'
    )
    .count('comments.comment_id AS comment_count')
    .where({ 'articles.article_id': article_id })
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .groupBy('articles.article_id')
    .then(result => {
      if (!result.length)
        return Promise.reject({ status: 404, msg: 'No articles found!' });
      return result[0];
    });
}

function selectArticles(query) {
  const { sort_by = 'created_at', order = 'desc', author, topic } = query;
  if (order !== 'asc' && order !== 'desc') {
    return Promise.reject({ code: '42703' });
  }
  return client('articles')
    .select('articles.*')
    .count('comments.comment_id AS comment_count')
    .leftJoin('comments', 'comments.article_id', 'articles.article_id')
    .orderBy(`articles.${sort_by}`, order)
    .groupBy('articles.article_id')
    .modify(queryBuilder => {
      if (author) queryBuilder.where({ 'articles.author': author });
    })
    .modify(queryBuilder => {
      if (topic) queryBuilder.where({ 'articles.topic': topic });
    })
    .then(result => {
      if (!result.length)
        return Promise.reject({ status: 404, msg: 'No articles found!' });
      return result;
    });
}

function updateArticle(article_id, votes) {
  return client('articles')
    .increment({ votes })
    .where({ article_id })
    .returning('*')
    .then(result => {
      if (!result.length)
        return Promise.reject({ status: 404, msg: 'No articles found!' });
      return result[0];
    });
}

function insertComment(article_id, { username, body }) {
  return client('comments')
    .insert({ author: username, article_id, body })
    .returning('*')
    .then(result => {
      return result[0];
    });
}

function selectComments(article_id, query) {
  const { sort_by = 'created_at', order = 'desc' } = query;
  if (order !== 'asc' && order !== 'desc') {
    return Promise.reject({ code: '42703' });
  }
  return client('comments')
    .select('comment_id', 'author', 'votes', 'created_at', 'body')
    .where({ article_id })
    .orderBy(sort_by, order)
    .then(result => {
      if (!result.length)
        return Promise.reject({ status: 404, msg: 'No comments found!' });
      return result;
    });
}

module.exports = {
  selectArticle,
  selectArticles,
  updateArticle,
  insertComment,
  selectComments
};
