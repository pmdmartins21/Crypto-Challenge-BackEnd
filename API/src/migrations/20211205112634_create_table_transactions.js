const { now } = require("moment");

exports.up = (knex) => {
  return knex.schema.createTable('transactions', (t) => {
    t.increments('id').primary();
    t.integer('games_users_id')
      .references('id')
      .inTable('games_users')
      .notNull();
    t.integer('crypto_id')
      .references('id')
      .inTable('cryptos')
      .notNull();
    t.timestamp('date').notNull();
    t.enu('type', ['B', 'S']).notNull(); //Type "Buy" or "Sell"
    t.decimal('amount', 15, 2).notNull();
    t.decimal('crypto_value', 15, 2).notNull(); //Crypto value at the time of the transaction
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('transactions');
};
