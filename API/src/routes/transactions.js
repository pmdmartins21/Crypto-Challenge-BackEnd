const express = require('express');
const ForbiddenError = require('../errors/forbiddenError');

module.exports = (app) => {
  const router = express.Router();

  router.param('user_id', (req, res, next) => { //testar
    app.services.user.findOne({ id: req.params.user_id })
      .then((user) => {
        if (user.id !== req.user.id) throw new ForbiddenError();
        else next();
      }).catch((err) => next(err));
  });

  router.post('/', async (req, res, next) => {
    await app.services.transaction.save(req.body)
          .then((result) => res.status(201).json(result[0]))
      .catch((err) => next(err));
  });

  router.get('/all/:user_id', async (req, res, next) => {
    app.services.transaction.findAll({ id: req.params.user_id })
      .then((trans) => {
      return res.status(200).json(trans);
        })
      .catch((err) => next(err));
  });

  router.get('/:id', async (req, res, next) => {
    app.services.transaction.findOne({ id: req.params.id })
      .then(async(trans) => {
      return res.status(200).json(trans);
        })
      .catch((err) => next(err));
  });

  return router;
};
