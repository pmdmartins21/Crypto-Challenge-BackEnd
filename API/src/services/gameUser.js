const { use } = require('passport');
const { user } = require('pg/lib/defaults');
const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('games_users').where(filter).select('*');
  };

  const findOne = (filter = {}) => {
    return app.db('games_users').where(filter).first();
  };

  const save = async (game_user) => {
    if (!game_user.user_id) throw new ValidationError('USER_ID é um atributo obrigatório');
    if (!game_user.game_id) throw new ValidationError('GAME_ID é um atributo obrigatório');

    // const gameDb = await findOne({ name: crypto.name });
    // if (cryptoDb) throw new ValidationError('Name duplicado na Bd');

    return app.db('games_users').insert(game_user, ['*']);
  };

  const update = async (gameUserId, cryptoValue) => {
    let userBalance = await checkBalance(gameUserId);

    if (cryptoValue > 0) {
      userBalance += cryptoValue;
    }
    else {
      if(userBalance < Math.abs(cryptoValue)) throw new ValidationError('Não tem saldo suficiente para a transação');
      userBalance += cryptoValue;
    } 
    
    return app.db('games_users')
      .where({ id: gameUserId })
      .update({cashBalance: userBalance}, '*');
  };

  //com o findOne não deve ser necessário esta parte...
  const checkBalance = async (gameUserId) => {
    const gameUserDb = await findOne({ id: gameUserId });
    return Number(gameUserDb.cashBalance);
  }

  // const remove = async (id) => {
  //   const game = await app.services.game.findOne({ id: id });
  //   if (!game) throw new ValidationError('O Game não existe na BD');

  //   return app.db('games')
  //     .where({ id })
  //     .del();
  // };

  return { findAll, findOne, update, save };
};
