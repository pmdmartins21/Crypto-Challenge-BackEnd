const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    app.services.crypto.findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/:id', (req, res, next) => {
    app.services.crypto.findOne({ id: req.params.id })
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => next(err));
  });

  router.get('/timeSeries/:game_id', (req, res, next) => {
    app.services.crypto.getCryptoTimeSeries(req.params.game_id)
      .then((result) => {
        return res.status(200).json(result);
      })
      .catch((err) => next(err));
  });

  router.post('/', async (req, res, next) => {
    try {
      const result = await app.services.crypto.save(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  router.put('/:id', (req, res, next) => {
    app.services.crypto.update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  });

  router.delete('/:id', (req, res, next) => {
    app.services.crypto.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  return router;
};