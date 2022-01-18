const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const find = (filter = {}) => {
    return app.db('games_users')
    .innerJoin('users', 'games_users.user_id', 'users.id')
    .where(filter)
    .orderBy('cashBalance', 'desc')
    .select('games_users.game_id', 'users.firstName', 'users.lastName', 'games_users.cashBalance');
  };

  // const findOne = (filter = {}) => {
  //   return app.db('games').where(filter).first();
  // };

  // const save = async (game) => {
  //   if (!game.startDate) throw new ValidationError('StartDate é um atributo obrigatório');

  //   // const gameDb = await findOne({ name: crypto.name });
  //   // if (cryptoDb) throw new ValidationError('Name duplicado na Bd');

  //   return app.db('games').insert(game, ['*']);
  // };

  // const update = (id, game) => {
  //   return app.db('games')
  //     .where({ id })
  //     .update(game, '*');
  // };

  // const remove = async (id) => {
  //   const game = await app.services.game.findOne({ id: id });
  //   if (!game) throw new ValidationError('O Game não existe na BD');

  //   return app.db('games')
  //     .where({ id })
  //     .del();
  // };

  return { find };
};
