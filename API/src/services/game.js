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

    //TODO garantir que quando um user entra num jogo, que sao criadas as wallets das cryptos a 0.
    var a = new Date(game.startDate);
    var b = new Date(game.endDate);
    var difference = (b - a) / 1000;
    game.totalSeconds = difference;

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
