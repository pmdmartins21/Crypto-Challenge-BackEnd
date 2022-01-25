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
    .then(() => knex('users').insert([
      {
        firstName: 'Pedro',
        lastName: 'Martins',
        username: 'admin',
        password: 'admin',
        email: 'admin@cryptochallenge.com',
        isAdmin: true
      },
      {
        firstName: 'Telmo',
        lastName: 'Paiva',
        username: 'admin2',
        password: 'admin2',
        email: 'admin2@cryptochallenge.com',
        isAdmin: true
      },
    ]))
    .then(() => knex('games').insert(
      {
        startDate: '2022-01-25T19:00:00.249Z',
        endDate: '2022-01-25T19:05:00.249Z',
        totalSeconds: 300,
        bitcoin_starting_point: 620,
        ethereum_starting_point: 1222,
        cardano_starting_point: 1023,
        dogecoin_starting_point: 1184,
      }
  ))
};