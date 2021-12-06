const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auths);

  const secureRouter = express.Router();

  secureRouter.use('/users', app.routes.users);
  secureRouter.use('/cryptos', app.routes.cryptos);
  secureRouter.use('/games', app.routes.games);
  secureRouter.use('/leaderboards', app.routes.leaderboards);
  secureRouter.use('/gameWallet', app.routes.gameWallet);
  secureRouter.use('/gameUsers', app.routes.gameWallet);
  secureRouter.use('/transactions', app.routes.transactions);

  app.use('/v1', app.config.passport.authenticate(), secureRouter);
};
