exports.up = (knex) => {
  return knex.schema.createTable('games', (t) => {
    t.increments('id').primary();
    t.timestamp('startDate').notNull();
    t.timestamp('endDate').notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('games');
};
