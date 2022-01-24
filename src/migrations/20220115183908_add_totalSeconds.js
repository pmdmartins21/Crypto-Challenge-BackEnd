exports.up = (knex) => {
  return knex.schema.table('games', (t) => {
    t.integer('totalSeconds').defaultTo(0);
  });
};

exports.down = (knex) => {
  return knex.schema.table('games', (t) => {
    table.dropColumn('totalSeconds');
  })
};
