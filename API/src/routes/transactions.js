const express = require('express');
const ForbiddenError = require('../errors/forbiddenError');

module.exports = (app) => {
  const router = express.Router();

  router.param('user_id', (req, res, next) => {
    app.services.user.findOne({ id: req.params.user_id })
      .then((user) => {
        if (user.id !== req.user.id) throw new ForbiddenError();
        else next();
      }).catch((err) => next(err));
  });

  // router.get('/', (req, res, next) => {
  //   app.services.game.findAll()
  //     .then((result) => res.status(200).json(result))
  //     .catch((err) => next(err));
  // });

  router.post('/', async (req, res, next) => {
    //let cryptoValue = req.body.amount * req.body.crypto_value;
    //passar o tipo de transaçao? estou a assumir que o amount se for venda é negativo e positivo se for compra
    
    await app.services.transaction.save(req.body)
          .then((result) => res.status(201).json(result[0]))
      .catch((err) => next(err));
  });

  router.get('/:user_id', async (req, res, next) => {
    app.services.transaction.findAll({ id: req.params.user_id })
      .then(async(trans) => {
        //if (gameUser.user_id !== req.user.id) return res.status(403).json({ error: 'Não tem acesso ao recurso solicitado' });      
      return res.status(200).json(trans);
        })
      .catch((err) => next(err));
  });

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
