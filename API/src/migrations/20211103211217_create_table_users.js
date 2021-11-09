exports.up = (knex) => {
  return knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('firstName').notNull();
    t.string('lastName').notNull();
    t.string('username').notNull().unique();
    t.string('password').notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('users');
};
