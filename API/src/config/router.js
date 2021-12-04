const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auths);
  app.use('/cryptos', app.routes.cryptos);

  const secureRouter = express.Router();

  secureRouter.use('/users', app.routes.users);
  //secureRouter.use('/cryptos', app.routes.cryptos);

  app.use('/v1', app.config.passport.authenticate(), secureRouter);
};
