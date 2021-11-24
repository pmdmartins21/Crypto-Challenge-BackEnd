exports.up = (knex) => {
  return knex.schema.createTable('wallets', (t) => {
    t.increments('id').primary();
    t.integer('CryptoId')
      .references('id')
      .inTable('cryptos')
      .notNull();
    t.float('amount');
    t.integer('user_id')
      .references('id')
      .inTable('users')
      .notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('wallets');
};
