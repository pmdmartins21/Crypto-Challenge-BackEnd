exports.up = (knex) => {
  return knex.schema.table('games', (t) => {
    t.integer('bitcoin_starting_point').defaultTo(1);
    t.integer('ethereum_starting_point').defaultTo(1);
    t.integer('cardano_starting_point').defaultTo(1);
    t.integer('dogecoin_starting_point').defaultTo(1);
  });
};

exports.down = (knex) => {
  return knex.schema.table('games', (t) => {
    table.dropColumn('bitcoin_starting_point');
    table.dropColumn('ethereum_starting_point');
    table.dropColumn('cardano_starting_point');
    table.dropColumn('dogecoin_starting_point');
  })
};