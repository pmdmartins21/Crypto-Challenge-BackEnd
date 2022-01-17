const { use } = require('passport');
const { user } = require('pg/lib/defaults');
const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('games_users').where(filter).select('*');
  };

  const findAllGameUsersID = (filter = {}) => {
    return app.db('games_users').where(filter).select('id');
  };

  const findOne = (filter = {}) => {
    return app.db('games_users').where(filter).first();
  };

  const save = async (newGameInfo) => {
    let result;

    if (!newGameInfo.user_id) throw new ValidationError('USER_ID é um atributo obrigatório');
    if (!newGameInfo.game_id) throw new ValidationError('GAME_ID é um atributo obrigatório');

    const game_user_Db = await findOne(newGameInfo);
    if (game_user_Db) throw new ValidationError('O user já está registado neste jogo');

    
    result = await app.db('games_users').insert(newGameInfo, ['*']);
    
    const cryptos = await app.services.crypto.findAll();

    for(let i = 0; i< cryptos.length; i++) {
      await app.services.gameWallet.save({games_users_id: result[0].id, crypto_id: cryptos[i].id});
    }
    return result[0];

  };

  const update = async (trans) => {
    let transValue = trans.amount * trans.crypto_value;
    let userBalance = await checkBalance(trans.games_users_id);

    //Amount < 0 == Venda
    if (transValue < 0) {
      userBalance += Math.abs(transValue);
    }
    else { // Compra
      if(userBalance < transValue) throw new ValidationError('Não tem saldo suficiente para a transação');
      userBalance -= transValue;
    } 
    
    return app.db('games_users')
      .where({ id: trans.games_users_id })
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

  return { findAllGameUsersID, findAll, findOne, update, save };
};
