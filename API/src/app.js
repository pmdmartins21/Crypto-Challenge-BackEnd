const app = require('express')();
const cors = require('cors');
const consign = require('consign');

const knex = require('knex');
const knexfile = require('../knexfile');

app.db = knex(knexfile.test);
app.use(cors());

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match 
//   //the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
//   });


consign({ cwd: 'src', verbose: false })
  .include('./config/passport.js')
  .then('./config/middlewares.js')
  .then('./services')
  .then('./routes') 
  .then('./config/router.js')
  .into(app);

app.get('/', (req, res) => {
  res.status(200).send();
});

app.use((err, req, res, next) => {
  const { name, message, stack } = err;
  if (name === 'validationError') res.status(400).json({ error: message });
  else if (name === 'forbiddenError') res.status(403).json({ error: message });
  else {
    console.log(message);
    res.status(500).json({ name, message, stack });
  }
  next(err);
});

module.exports = app;
