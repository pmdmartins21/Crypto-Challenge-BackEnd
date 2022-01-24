const express = require('express');
const ForbiddenError = require('../errors/forbiddenError');

module.exports = (app) => {
  const router = express.Router();

  router.param('game_user_id', (req, res, next) => {
    app.services.gameUser.findOne({ id: req.params.game_user_id })
      .then((gameUser) => {
        if (gameUser.user_id !== req.user.id) throw new ForbiddenError();
        else next();
      }).catch((err) => next(err));
  });

  //retornar a carteira com todas as moedas + o saldo em dinheiro disponivel
  router.get('/:game_user_id', async (req, res, next) => {
    let gameUser = await app.services.gameUser.findOne({ id: req.params.game_user_id });
    
    return await app.services.gameWallet.getCompleteWallet( gameUser.id, gameUser.cashBalance )
    .then((results) => res.status(200).json(results))
    .catch((err) => next(err));
  });

  return router;
};
