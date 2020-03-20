const chai = require('chai');
const expect = chai.expect;

chai.use(require('chai-sorted'));

const request = require('supertest');
const app = require('../app');
const client = require('../db/connection');

after(() => {
  client.destroy();
});

beforeEach(() => {
  return client.seed.run();
});

describe('NC NEWS API TESTING', () => {
  describe('/api', () => {
    it('GET request, should return all routers', () => {
      request(app)
        .get('/api')
        .expect(200)
        .then(result => {
          expect(result.body.api).to.be.an('object');
        });
    });
  });

  describe('/api/topics', () => {
    it('GET request should return all topics information', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.topics[0]).to.have.all.keys(['slug', 'description']);
          expect(res.body.topics[0].slug).to.equal('mitch');
          expect(res.body.topics[0].description).to.equal(
            'The man, the Mitch, the legend'
          );
        });
    });
  });

  describe('/api/users/:username', () => {
    it('GET request should return specified user information', () => {
      return request(app)
        .get('/api/users/rogersop')
        .expect(200)
        .then(res => {
          expect(res.body.user).to.have.all.keys([
            'username',
            'avatar_url',
            'name'
          ]);
          expect(res.body.user.username).to.equal('rogersop');
          expect(res.body.user.name).to.equal('paul');
          expect(res.body.user.avatar_url).to.equal(
            'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
          );
        });
    });
    it('GET request with user name not in db', () => {
      return request(app)
        .get('/api/users/mike')
        .expect(404);
    });
  });

  describe('/api/articles/:article_id', () => {
    context('GET', () => {
      it('should return article information', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(result => {
            expect(result.body.article).to.have.all.keys([
              'author',
              'title',
              'article_id',
              'body',
              'topic',
              'created_at',
              'votes',
              'comment_count'
            ]);
            expect(result.body.article.comment_count).to.equal(13);
          });
      });
      it('article_id not in db', () => {
        return request(app)
          .get('/api/articles/0')
          .expect(404);
      });
      it('bad article_id', () => {
        return request(app)
          .get('/api/articles/mike')
          .expect(400);
      });
    });
    context('PATCH', () => {
      it('should return article information - increment by 1', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 1 })
          .expect(200)
          .then(result => {
            expect(result.body.article).to.have.all.keys([
              'author',
              'title',
              'article_id',
              'body',
              'topic',
              'created_at',
              'votes'
            ]);
            expect(result.body.article.votes).to.equal(101);
          });
      });
      it('should return article information - decrement 50', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: -50 })
          .expect(200)
          .then(result => {
            expect(result.body.article).to.have.all.keys([
              'author',
              'title',
              'article_id',
              'body',
              'topic',
              'created_at',
              'votes'
            ]);
            expect(result.body.article.votes).to.equal(50);
          });
      });
      it('article_id not in db', () => {
        return request(app)
          .patch('/api/articles/0')
          .send({ inc_votes: 1 })
          .expect(404);
      });
      it('no body sent and article exists', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({})
          .expect(200)
          .then(result => {
            expect(result.body.article).to.have.all.keys([
              'author',
              'title',
              'article_id',
              'body',
              'topic',
              'comment_count',
              'created_at',
              'votes'
            ]);
          });
      });
      it('invalid inc_votes', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 'MIKE' })
          .expect(400);
      });
    });
  });
  describe('/api/articles/:article_id/comments', () => {
    context('POST', () => {
      it('should a new comment to an article and return comment', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({ username: 'rogersop', body: 'new Comment' })
          .expect(201)
          .then(result => {
            expect(result.body.comment).to.have.all.keys([
              'comment_id',
              'author',
              'article_id',
              'votes',
              'created_at',
              'body'
            ]);
            expect(result.body.comment.author).to.equal('rogersop');
            expect(result.body.comment.body).to.equal('new Comment');
          });
      });
      it('article_id not in db', () => {
        return request(app)
          .post('/api/articles/0/comments')
          .send({ username: 'rogersop', body: 'new Comment' })
          .expect(404);
      });
      it('no body sent', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({})
          .expect(400);
      });
      it('username is missing from body', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({ body: 'test' })
          .expect(400);
      });
      it('body is missing from body', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({ username: 'rogersop' })
          .expect(400);
      });
    });
    context('GET', () => {
      it('should return all the comments for the article', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(result => {
            expect(result.body.comments[0]).to.have.all.keys([
              'comment_id',
              'author',
              'votes',
              'created_at',
              'body'
            ]);
          });
      });
      it('should return all the comments for the article sorted by created date', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=created_at')
          .expect(200)
          .then(result => {
            expect(result.body.comments).to.be.sortedBy('created_at', {
              descending: true
            });
          });
      });
      it('should return all the comments for the article sorted by comment_id ascending', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=comment_id&order=asc')
          .expect(200)
          .then(result => {
            expect(result.body.comments).to.be.sortedBy('comment_id');
          });
      });
      it('invalid sort_by key', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=comment_d&order=asc')
          .expect(400);
      });
      it('invalid order value', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=comment_id&order=test')
          .expect(400);
      });
      it('article_id not in db', () => {
        return request(app)
          .get('/api/articles/0/comments')
          .expect(404);
      });
      it('article_id in db, but no comments', () => {
        return request(app)
          .get('/api/articles/2/comments')
          .expect(200)
          .then(result => {
            expect(result.body.comments).to.eql([]);
          });
      });
    });
  });
  describe('/api/articles', () => {
    context('POST', () => {
      it('create a new article', () => {
        return request(app)
          .post('/api/articles/')
          .send({
            title: 'test',
            body: 'test2',
            topic: 'mitch',
            author: 'butter_bridge'
          })
          .expect(201)
          .then(result => {
            expect(result.body.article.title).to.equal('test');
            expect(result.body.article.body).to.equal('test2');
            expect(result.body.article.topic).to.equal('mitch');
            expect(result.body.article.author).to.equal('butter_bridge');
            expect(result.body.article.votes).to.equal(0);
            expect(result.body.article).to.have.all.keys([
              'author',
              'title',
              'article_id',
              'body',
              'topic',
              'created_at',
              'votes'
            ]);
          });
      });
      it('create a new article', () => {
        return request(app)
          .post('/api/articles/')
          .send({
            title: 'test',
            body: 'test2',
            topic: 'mitch',
            author: 'butter_bridge'
          })
          .expect(201)
          .then(result => {
            expect(result.body.article.title).to.equal('test');
            expect(result.body.article.body).to.equal('test2');
            expect(result.body.article.topic).to.equal('mitch');
            expect(result.body.article.author).to.equal('butter_bridge');
            expect(result.body.article.votes).to.equal(0);
            expect(result.body.article).to.have.all.keys([
              'author',
              'title',
              'article_id',
              'body',
              'topic',
              'created_at',
              'votes'
            ]);
          });
      });
      it('create a new article with added vote', () => {
        return request(app)
          .post('/api/articles/')
          .send({
            title: 'test',
            body: 'test2',
            topic: 'mitch',
            author: 'butter_bridge',
            votes: 10
          })
          .expect(201)
          .then(result => {
            expect(result.body.article.votes).to.equal(10);
          });
      });
      it('invalid user', () => {
        return request(app)
          .post('/api/articles/')
          .send({
            title: 'test',
            body: 'test2',
            topic: 'mitch',
            author: 'butter_bridge2',
            votes: 10
          })
          .expect(404);
      });
      it('no body', () => {
        return request(app)
          .post('/api/articles/')
          .send({})
          .expect(400);
      });
      it('incorrect data type', () => {
        return request(app)
          .post('/api/articles/')
          .send({
            title: 'test',
            body: 'test2',
            topic: 'mitch',
            author: 'butter_bridge',
            votes: 'test'
          })
          .expect(400);
      });
    });
    context('GET', () => {
      it('returns all the articles', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(result => {
            expect(result.body.articles[0]).to.have.all.keys([
              'author',
              'title',
              'article_id',
              'body',
              'topic',
              'created_at',
              'votes',
              'comment_count'
            ]);
            expect(result.body.articles[0].votes).to.equal(100);
          });
      });
      it('should return all articles sorted by created date', () => {
        return request(app)
          .get('/api/articles?sort_by=created_at')
          .expect(200)
          .then(result => {
            expect(result.body.articles).to.be.sortedBy('created_at', {
              descending: true
            });
          });
      });
      it('should return all articles sorted by article_id ascending', () => {
        return request(app)
          .get('/api/articles?sort_by=article_id&order=asc')
          .expect(200)
          .then(result => {
            expect(result.body.articles).to.be.sortedBy('article_id');
          });
      });
      it('invalid sort_by key', () => {
        return request(app)
          .get('/api/articles?sort_by=article_d&order=asc')
          .expect(400);
      });
      it('invalid order value', () => {
        return request(app)
          .get('/api/articles?sort_by=article_id&order=test')
          .expect(400);
      });
      it('filters by author', () => {
        return request(app)
          .get('/api/articles?author=rogersop')
          .expect(200)
          .then(result => {
            result.body.articles.forEach(article => {
              expect(article.author).to.equal('rogersop');
            });
          });
      });
      it('filters by topic', () => {
        return request(app)
          .get('/api/articles?topic=cats')
          .expect(200)
          .then(result => {
            result.body.articles.forEach(article => {
              expect(article.topic).to.equal('cats');
            });
          });
      });
      it('filters by topic - non existing', () => {
        return request(app)
          .get('/api/articles?topic=rats')
          .expect(404);
      });
      it('filters by topic - topic exists, but no articles', () => {
        return request(app)
          .get('/api/articles?topic=paper')
          .expect(200)
          .then(result => {
            expect(result.body.articles).to.eql([]);
          });
      });
      it('filters by author - author exists, but no articles', () => {
        return request(app)
          .get('/api/articles?author=lurker')
          .expect(200)
          .then(result => {
            expect(result.body.articles).to.eql([]);
          });
      });
      it('filters by author  & topic - author exists, topic doesnt, but no articles', () => {
        return request(app)
          .get('/api/articles?author=lurker&topic=rats')
          .expect(404);
      });
    });
    context('PATCH', () => {
      it('should return comment information - increment by 1', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 1 })
          .expect(200)
          .then(result => {
            expect(result.body.comment).to.have.all.keys([
              'author',
              'comment_id',
              'article_id',
              'body',
              'created_at',
              'votes'
            ]);
            expect(result.body.comment.votes).to.equal(17);
          });
      });
      it('should return comment information - decrement 50', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: -50 })
          .expect(200)
          .then(result => {
            expect(result.body.comment).to.have.all.keys([
              'author',
              'comment_id',
              'article_id',
              'body',
              'created_at',
              'votes'
            ]);
            expect(result.body.comment.votes).to.equal(-34);
          });
      });
      it('comment_id not in db', () => {
        return request(app)
          .patch('/api/comments/0')
          .send({ inc_votes: 1 })
          .expect(404);
      });
      it('no body sent', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({})
          .expect(200)
          .then(result => {
            expect(result.body.comment).to.have.all.keys([
              'author',
              'comment_id',
              'article_id',
              'body',
              'created_at',
              'votes'
            ]);
            expect(result.body.comment.votes).to.equal(16);
          });
      });
    });
    context('DELETE', () => {
      it('should delete comment and return 204', () => {
        return request(app)
          .delete('/api/comments/1')
          .expect(204);
      });
      it('invalid comment id should return 404', () => {
        return request(app)
          .delete('/api/comments/0')
          .expect(404);
      });
    });
  });
  describe('405 tests- INVALID METHODS', () => {
    it('/api', () => {
      const invalidMethods = ['post', 'patch', 'put', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api')
          .expect(405);
      });
      return Promise.all(methodPromises);
    });
    it('/api/topics', () => {
      const invalidMethods = ['post', 'patch', 'put', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/topics')
          .expect(405);
      });
      return Promise.all(methodPromises);
    });
    it('/api/articles', () => {
      const invalidMethods = ['patch', 'put', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/articles')
          .expect(405);
      });
      return Promise.all(methodPromises);
    });
    it('/api/articles/:article_id', () => {
      const invalidMethods = ['post', 'put', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/articles/1')
          .expect(405);
      });
      return Promise.all(methodPromises);
    });
    it('/api/articles/:article_id/comments', () => {
      const invalidMethods = ['patch', 'put', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/articles/1/comments')
          .expect(405);
      });
      return Promise.all(methodPromises);
    });
    it('/api/comments/:comment_id', () => {
      const invalidMethods = ['get', 'post', 'put'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/comments/1')
          .expect(405);
      });
      return Promise.all(methodPromises);
    });
  });
  describe('pagination', () => {
    context('/api/articles', () => {
      it('limit is 5 return first page', () => {
        return request(app)
          .get('/api/articles?limit=5&p=1')
          .expect(200)
          .then(result => {
            expect(result.body.total_count).to.equal(12);
            expect(result.body.articles.length).to.equal(5);
            expect(result.body.articles[0].article_id).to.equal(1);
            expect(result.body.articles[4].article_id).to.equal(5);
          });
      });
      it('limit is 2 return 2nd page', () => {
        return request(app)
          .get('/api/articles?limit=2&p=2')
          .expect(200)
          .then(result => {
            expect(result.body.total_count).to.equal(12);
            expect(result.body.articles.length).to.equal(2);
            expect(result.body.articles[0].article_id).to.equal(3);
            expect(result.body.articles[1].article_id).to.equal(4);
          });
      });
      it('limit is 5 return 1st page and topic filter is mitch', () => {
        return request(app)
          .get('/api/articles?limit=5&p=1&topic=mitch')
          .expect(200)
          .then(result => {
            expect(result.body.total_count).to.equal(11);
            expect(result.body.articles.length).to.equal(5);
            expect(result.body.articles[0].article_id).to.equal(1);
            expect(result.body.articles[4].article_id).to.equal(6);
          });
      });
    });
    context('/api/articles/:article_id/comments', () => {
      it('limit is 5 return first page', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=5&p=1')
          .expect(200)
          .then(result => {
            expect(result.body.total_count).to.equal(13);
            expect(result.body.comments.length).to.equal(5);
            expect(result.body.comments[0].comment_id).to.equal(2);
            expect(result.body.comments[4].comment_id).to.equal(6);
          });
      });
      it('limit is 2 return 2nd page', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=2&p=2')
          .expect(200)
          .then(result => {
            expect(result.body.total_count).to.equal(13);
            expect(result.body.comments.length).to.equal(2);
            expect(result.body.comments[0].comment_id).to.equal(4);
            expect(result.body.comments[1].comment_id).to.equal(5);
          });
      });
    });
  });
});
