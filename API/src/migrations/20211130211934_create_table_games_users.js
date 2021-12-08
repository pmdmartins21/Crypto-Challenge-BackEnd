exports.up = (knex) => {
  return knex.schema.createTable('games_users', (t) => {
    t.increments('id').primary();
    t.integer('user_id')
      .references('id')
      .inTable('users')
      .notNull();
    t.integer('game_id')
      .references('id')
      .inTable('games')
      .notNull();
      t.decimal('cashBalance', 15, 2).notNull().defaultTo(50000);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('games_users');
};
