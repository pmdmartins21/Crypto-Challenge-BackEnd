exports.up = (knex) => {
  return knex.schema.createTable('dogecoin', (t) => {
    t.increments('id').primary();
    t.integer('sno').notNull();
    t.string('name').notNull();
    t.string('symbol').notNull();
    t.timestamp('date').notNull();
    t.decimal('high').notNull();
    t.decimal('low').notNull();
    t.decimal('open').notNull();
    t.decimal('close').notNull();
    t.double('marketcap').notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('dogecoin');
};
