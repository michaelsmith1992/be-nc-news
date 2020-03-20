const client = require('../db/connection');
const { getUser } = require('./users.model');
const { getTopics } = require('./topics.model');

function selectArticle(article_id) {
  return client('articles')
    .select('articles.*')
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
  const newQuery = { ...query };
  newQuery.limit = null;
  newQuery.p = null;
  return Promise.all([
    articleQuery(query),
    articleQuery(newQuery),
    query.author ? getUser(query.author) : undefined,
    query.topic ? getTopics(query.topic) : undefined
  ]).then(([result, rowCount, author, topic]) => {
    if (query.author && author && !result.length) result = [];
    else if (query.author && !author) {
      return Promise.reject({ status: 404, msg: 'No articles found!' });
    }
    if (query.topic && topic.length && !result.length) result = [];
    else if (query.topic && !topic.length) {
      return Promise.reject({ status: 404, msg: 'No articles found!' });
    }
    return {
      total_count: rowCount.length,
      articles: result
    };
  });
}

function updateArticle(article_id, votes) {
  if (!votes) {
    return selectArticle(article_id);
  }
  return client('articles')
    .increment({ votes })
    .where({ article_id })
    .returning('*')
    .then(result => {
      if (!result.length) {
        return Promise.reject({ status: 404, msg: 'No articles found!' });
      }
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
  const countQuery = { ...query };
  countQuery.limit = null;
  countQuery.p = null;
  return Promise.all([
    commentQuery(article_id, query),
    commentQuery(article_id, countQuery)
  ]).then(([result, count]) => {
    if (!result.length)
      return selectArticle(article_id)
        .then(() => {
          return { comments: [], total_count: count.length };
        })
        .catch(err => {
          return Promise.reject({ status: 404, msg: 'No comments found!' });
        });
    return { comments: result, total_count: count.length };
  });
}

function articleQuery(query) {
  const {
    sort_by = 'created_at',
    order = 'desc',
    author,
    topic,
    limit = 10,
    p = 1
  } = query;
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
      if (topic) queryBuilder.where({ 'articles.topic': topic });
      if (limit !== null && p !== null)
        queryBuilder.limit(limit).offset(limit * p - limit);
    });
}

function commentQuery(article_id, query) {
  const { sort_by = 'created_at', order = 'desc', limit = 10, p = 1 } = query;
  if (order !== 'asc' && order !== 'desc') {
    return Promise.reject({ code: '42703' });
  }
  return client('comments')
    .select('comment_id', 'author', 'votes', 'created_at', 'body')
    .where({ article_id })
    .orderBy(sort_by, order)
    .modify(queryBuilder => {
      if (limit !== null && p !== null)
        queryBuilder.limit(limit).offset(limit * p - limit);
    });
}

function insertArticle({ title, body, topic, author, votes = 0 }) {
  return client('articles')
    .insert({ title, body, topic, author, votes })
    .returning('*')
    .then(result => {
      return result[0];
    });
}

module.exports = {
  selectArticle,
  selectArticles,
  updateArticle,
  insertComment,
  selectComments,
  insertArticle
};
