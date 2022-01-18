const express = require('express');
const ForbiddenError = require('../errors/forbiddenError');

module.exports = (app) => {
  const router = express.Router();

  router.param('id', (req, res, next) => {
    app.services.gameUser.findOne({ id: req.params.id })
      .then((gameUser) => {
        if (gameUser.user_id !== req.user.id) throw new ForbiddenError();
        else next();
      }).catch((err) => next(err));
  });

  router.post('/:game_id/:user_id', async (req, res, next) => {
    await app.services.gameUser.save({ game_id: req.params.game_id, user_id: req.params.user_id })
    .then((result) => {
      return res.status(201).json(result)
    })
      .catch((err) => next(err));
      });

  router.put('/:id', (req, res, next) => {
    app.services.gameUser.update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  });

  return router;
};
