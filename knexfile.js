const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE_TEST,
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
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE_PROD,
      ssl: { rejectUnauthorized: false },
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
