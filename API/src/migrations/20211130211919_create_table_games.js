exports.up = (knex) => {
  return knex.schema.createTable('games', (t) => {
    t.increments('id').primary();
    t.date('startDate').notNull().defaultTo(Date.now());
    t.date('endDate').notNull().defaultTo(Date.now());
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('games');
};
