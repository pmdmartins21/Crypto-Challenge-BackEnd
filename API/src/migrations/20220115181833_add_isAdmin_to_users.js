exports.up = (knex) => {
  return knex.schema.table('users', (t) => {
    t.boolean('isAdmin').defaultTo(false);
  });
};

exports.down = (knex) => {
  return knex.schema.table('users', (t) => {
    table.dropColumn('isAdmin');
  })
};
