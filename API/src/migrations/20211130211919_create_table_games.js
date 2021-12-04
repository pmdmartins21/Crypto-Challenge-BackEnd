exports.up = (knex) => {
  return knex.schema.createTable('games', (t) => {
    t.increments('id').primary();
    t.date('startDate').notNull();
    t.date('endDate').notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('games');
};
