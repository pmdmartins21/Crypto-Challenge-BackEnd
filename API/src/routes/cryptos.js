const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  //configurar para só admins
  // router.param('id', (req, res, next) => {
  //   app.services.crypto.findOne({ id: req.params.id })
  //     .then((crypto) => {
  //       if (crypto.id !== req.crypto.id) throw new ForbiddenError();
  //       else next();
  //     }).catch((err) => next(err));
  // });

  router.get('/', (req, res, next) => {
    app.services.crypto.findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/:id', (req, res, next) => {
    app.services.crypto.findOne({ id: req.params.id })
      .then((result) => {
        //if (req.user.isAdmin) return res.status(403).json({ error: 'Não tem acesso ao recurso solicitado' }); só para admins
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