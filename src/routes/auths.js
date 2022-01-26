const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/validationError');

const secret = 'CdTp!DWM@202122';

module.exports = (app) => {
  const router = express.Router();

  router.post('/signin', (req, res, next) => {
    app.services.user.findOneAuth({ username: req.body.username })
      .then((user) => {
        if (!user) throw new ValidationError('Autenticação Inválida! #2');
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            id: user.id,
            username: user.username,
          };
          const token = jwt.encode(payload, secret);
          res.status(200).json({ token });
        } else throw new ValidationError('Autenticação Inválida!');
      }).catch((err) => next(err));
  });

  router.post('/signup', async (req, res, next) => {
    try {
      const result = await app.services.user.save(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
