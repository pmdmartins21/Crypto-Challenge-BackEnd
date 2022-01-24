exports.up = (knex) => {
  return knex.schema.alterTable('dogecoin', (t) => {
    t.decimal('high', 15, 2).notNull().alter();
    t.decimal('low', 15, 2).notNull().alter();
    t.decimal('open', 15, 2).notNull().alter();
    t.decimal('close', 15, 2).notNull().alter();
  });
};

exports.down = (knex) => {
  return knex.schema.alterTable('dogecoin', (t) => {
    t.decimal('high').notNull().alter();
    t.decimal('low').notNull().alter();
    t.decimal('open').notNull().alter();
    t.decimal('close').notNull().alter();
  })
};
