const app = require('express')();
const cors = require('cors');
const consign = require('consign');
const winston = require('winston');
const uuid = require('uuidv4');
const knex = require('knex');
const dotenv = require('dotenv');
dotenv.config();

const knexfile = require('../knexfile');

app.db = knex(knexfile[process.env.NODE_ENV]);
app.use(cors());

app.log = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({ format: winston.format.json({ space: 1 }) }),
    new winston.transports.File({
      filename: 'log/error.log',
      level: 'warn',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json({ space: 1 })),
    }),
  ],
});

consign({ cwd: 'src', verbose: false })
  .include('./config/passport.js')
  .then('./config/middlewares.js')
  .then('./services')
  .then('./routes') 
  .then('./config/router.js')
  .into(app);

app.get('/', (req, res) => {
  app.log.debug('passei por aqui');
  res.status(200).send();
});

app.use((err, req, res, next) => {
  const { name, message, stack } = err;
  if (name === 'validationError') res.status(400).json({ error: message });
  else if (name === 'forbiddenError') res.status(403).json({ error: message });
  else {
    const id = uuid();
    app.log.error(name, message, stack);
    res.status(500).json({ id, error: 'Erro de sistema' }); 
  }
  next(err);
});

module.exports = app;
