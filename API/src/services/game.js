const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('games').where(filter).select('*');
  };

  const findOne = (filter = {}) => {
    return app.db('games').where(filter).first();
  };

  const save = async (game) => {
    if (!game.startDate) throw new ValidationError('StartDate é um atributo obrigatório');

    // const gameDb = await findOne({ name: crypto.name });
    // if (cryptoDb) throw new ValidationError('Name duplicado na Bd');

    return app.db('games').insert(game, ['*']);
  };

  const update = (id, game) => {
    return app.db('games')
      .where({ id })
      .update(game, '*');
  };

  const remove = async (id) => {
    const game = await app.services.game.findOne({ id: id });
    if (!game) throw new ValidationError('O Game não existe na BD');

    return app.db('games')
      .where({ id })
      .del();
  };

  return { findAll, findOne, save, update, remove };
};
