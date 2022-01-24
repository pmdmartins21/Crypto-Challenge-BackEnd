const express = require('express');
const ForbiddenError = require('../errors/forbiddenError');

module.exports = (app) => {
  const router = express.Router();

  router.param('user_id', (req, res, next) => {
    app.services.user.findOne({ id: req.params.user_id })
      .then((user) => {
        if (user.id !== req.user.id && req.body.user_id !== null) throw new ForbiddenError();
        else next();
      }).catch((err) => next(err));
  });

  router.post('/:user_id', async (req, res, next) => {
    await app.services.gameUser.save(req.body)
    .then((result) => {
      return res.status(201).json(result)
    })
      .catch((err) => next(err));
      });

  return router;
};
