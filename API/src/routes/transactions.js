const express = require('express');
const ForbiddenError = require('../errors/forbiddenError');

module.exports = (app) => {
  const router = express.Router();

  // router.param('user_id', (req, res, next) => {
  //   app.services.gameWallet.findOne({ id: req.params.id })
  //     .then((gameWallet) => {
  //       if (user.id !== req.user.id) throw new ForbiddenError();
  //       else next();
  //     }).catch((err) => next(err));
  // });

  // router.get('/', (req, res, next) => {
  //   app.services.game.findAll()
  //     .then((result) => res.status(200).json(result))
  //     .catch((err) => next(err));
  // });

  router.post('/', (req, res, next) => {
    app.services.transaction.save(req.body)
      .then((result) => res.status(201).json(result[0]))
      .catch((err) => next(err));
  });

  router.post('/test', async (req, res, next) => {
    let cryptoValue = req.body.amount * req.body.crypto_value;
    //passar o tipo de transaçao? estou a assumir que o amount se for venda é negativo e positivo se for compra
    await app.services.gameUser.update(req.body.games_users_id, cryptoValue)
      .then(async () => await app.services.gameWallet.update(req.body.games_users_id, req.body.amount, req.body.crypto_id))
        .then(async () => await app.services.transaction.save(req.body))
          .then((result) => res.status(201).json(result[0]))
      .catch((err) => next(err));
  });

  // router.get('/:game_user_id', (req, res, next) => {
  //   let allresults;
  //   app.services.gameUser.findOne({ id: req.params.game_user_id })
  //     .then(async(gameUser) => {
  //      if (gameUser.user_id !== req.user.id) return res.status(403).json({ error: 'Não tem acesso ao recurso solicitado' });
  //      allresults =  await app.services.gameWallet.findAll({games_users_id: gameUser.id})
      
  //     return res.status(200).json(allresults);
  //       })
  //     .catch((err) => next(err));
  // });

  // router.delete('/:id', (req, res, next) => {
  //   app.services.game.remove(req.params.id)
  //     .then(() => res.status(204).send())
  //     .catch((err) => next(err));
  // });

  // router.put('/:id', (req, res, next) => {
  //   app.services.gameUser.update(req.params.id, req.body)
  //     .then((result) => res.status(200).json(result[0]))
  //     .catch((err) => next(err));
  // });

  return router;
};
