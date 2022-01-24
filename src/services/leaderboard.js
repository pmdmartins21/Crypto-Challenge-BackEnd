const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const find = async (filter = {}) => {
    return app.db('games_users')
    .innerJoin('users', 'games_users.user_id', 'users.id')
    .where(filter)
    .orderBy('cashBalance', 'desc')
    .select('games_users.game_id', 'users.firstName', 'users.lastName', 'games_users.cashBalance');
  };

  return { find };
};
