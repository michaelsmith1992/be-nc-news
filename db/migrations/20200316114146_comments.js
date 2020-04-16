exports.up = function (knex) {
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable.string('author').notNullable().references('users.username');
    commentsTable
      .integer('article_id')
      .references('articles.article_id')
      .onDelete('CASCADE');
    commentsTable.integer('votes').defaultsTo(0);
    commentsTable.timestamp('created_at').defaultTo(knex.fn.now());
    commentsTable.text('body').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('comments');
};
