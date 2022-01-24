exports.up = (knex) => {
  return knex.schema.createTable('ethereum', (t) => {
    t.increments('id').primary();
    t.integer('sno').notNull();
    t.string('name').notNull();
    t.string('symbol').notNull();
    t.timestamp('date').notNull();
    t.decimal('value', 15, 2).notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('ethereum');
};
