const express = require('express');
const ForbiddenError = require('../errors/forbiddenError');

module.exports = (app) => {
  const router = express.Router();

  router.param('user_id', (req, res, next) => {
    app.services.gameWallet.findOne({ id: req.params.id })
      .then((gameWallet) => {
        if (user.id !== req.user.id) throw new ForbiddenError();
        else next();
      }).catch((err) => next(err));
  });

  //retornar a carteira com todas as moedas + o saldo em dinheiro disponivel
  router.get('/:game_user_id', (req, res, next) => {
    app.services.gameUser.findOne({ id: req.params.game_user_id })
      .then(async(gameUser) => {
        if (gameUser.user_id !== req.user.id) return res.status(403).json({ error: 'Não tem acesso ao recurso solicitado' });
        return await app.services.gameWallet.getCompleteWallet( gameUser.id, gameUser.cashBalance )
        })
        .then((results) => res.status(200).json(results))
      .catch((err) => next(err));
  });

  return router;
};
