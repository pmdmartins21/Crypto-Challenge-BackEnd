exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('transactions').del()
    .then(() => knex('game_wallet').del())
    .then(() => knex('games_users').del())
    .then(() => knex('games').del())
    .then(() => knex('cryptos').del())
    .then(() => knex('users').del())
    .then(() => knex('cryptos').insert([
        {id: 1, name: 'Bitcoin'},
        {id: 2, name: 'Ethereum'},
        {id: 3, name: 'Dogecoin'},
        {id: 4, name: 'Cardano'},
      ]))
    .then(() => knex('users').insert(
        {
          firstName: 'Pedro',
          lastName: 'Martins',
          username: 'admin',
          password: 'admin',
          email: 'admin@cryptochallenge.com',
          isAdmin: true
        }
    ))
};