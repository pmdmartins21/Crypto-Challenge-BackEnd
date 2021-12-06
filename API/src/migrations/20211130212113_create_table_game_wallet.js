exports.up = (knex) => {
  return knex.schema.createTable('game_wallet', (t) => {
    t.increments('id').primary();
    t.integer('games_users_id')
      .references('id')
      .inTable('games_users')
      .notNull();
    t.integer('crypto_id')
      .references('id')
      .inTable('cryptos')
      .notNull();
    t.decimal('amount', 15, 2).notNull().defaultTo(0);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('game_wallet');
};
