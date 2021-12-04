exports.up = (knex) => {
  return knex.schema.createTable('cryptos', (t) => {
    t.increments('id').primary();
    t.string('name').notNull().unique();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('cryptos');
};
