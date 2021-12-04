exports.up = (knex) => {
  return knex.schema.createTable('game_wallet', (t) => {
    t.integer('user_id')
      .references('id')
      .inTable('users')
      .notNull();
    t.integer('crypto_id')
      .references('id')
      .inTable('cryptos')
      .notNull();
    t.decimal('amount', 15, 2).notNull().defaultTo(0);
    t.primary(['user_id', 'crypto_id']);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('game_wallet');
};
