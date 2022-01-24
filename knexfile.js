module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'ROOT',
      database: 'cryptochallenge',
    },
    debug: false,
    migrations: {
      directory: 'src/migrations',
    },
    seeds: {
      directory: './seeds'
    },
    pool: {
      min: 0,
      max: 50,
      propagateCreateError: false,
    },
  },
  prod: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'ROOT',
      database: 'cryptochallengeprod',
    },
    debug: false,
    migrations: {
      directory: 'src/migrations'
    },
    pool: {
      min: 0,
      max: 50,
      propagateCreateError: false,
    },
  },
};
