const express = require('express');
const ForbiddenError = require('../errors/forbiddenError');

module.exports = (app) => {
  const router = express.Router();

  router.param('game_id', (req, res, next) => {
    app.services.gameUser.findOne({ game_id: req.params.game_id })
      .then((gameUser) => {
        if (gameUser.user_id !== req.user.id) throw new ForbiddenError();
        else next();
      }).catch((err) => next(err));
  });

  router.get('/:game_id', async (req, res, next) => {
    app.services.leaderboard.find({ game_id: req.params.game_id })
      .then((gameLeaderboard) => {
        //if (gameUser.user_id !== req.user.id) return res.status(403).json({ error: 'Não tem acesso ao recurso solicitado' });      
      return res.status(200).json(gameLeaderboard);
        })
      .catch((err) => next(err));
  });

  return router;
};
