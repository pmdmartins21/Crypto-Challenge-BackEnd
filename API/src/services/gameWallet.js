const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('game_wallet').where(filter).select('*');
  };

  const findOne = (filter = {}) => {
    return app.db('game_wallet').where(filter).first();
  };

  const save = async (gameWallet) => {
    if (!gameWallet.games_users_id) throw new ValidationError('Game_User_ID é um atributo obrigatório');
    if (!gameWallet.crypto_id) throw new ValidationError('Crypto_ID é um atributo obrigatório');

    // const gameDb = await findOne({ name: crypto.name });
    // if (cryptoDb) throw new ValidationError('Name duplicado na Bd');

    return app.db('game_wallet').insert(gameWallet, ['*']);
  };

  // const update = async (gameUserId, cryptoCost) => {
  //   const gameUserDb = await findOne({ id: gameUserId });
  //   let userBalance = Number(gameUserDb.cashBalance);
  //   if(userBalance < cryptoCost.cost) throw new ValidationError('Não tem saldo suficiente para a transação');
    
  //   let newBalance = gameUserDb.cashBalance - cryptoCost.cost;

  //   return app.db('game_wallet')
  //     .where({ id: gameUserId })
  //     .update({cashBalance: newBalance}, '*');
  // };

  // const remove = async (id) => {
  //   const game = await app.services.game.findOne({ id: id });
  //   if (!game) throw new ValidationError('O Game não existe na BD');

  //   return app.db('games')
  //     .where({ id })
  //     .del();
  // };

  return { findAll, findOne, save };
};
