exports.up = (knex) => {
  return knex.schema.createTable('leaderboards', (t) => {
    t.increments('id').primary();
    t.integer('game_id')
      .references('id')
      .inTable('games')
      .notNull();
      t.integer('user_id')
      .references('id')
      .inTable('users')
      .notNull();
    t.decimal('finalCashBalance', 15, 2).notNull().defaultTo(0);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('leaderboards');
};
