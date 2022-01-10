const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('game_wallet').where(filter).select('*');
  };

  const findOne = (filter = {}) => {
    return app.db('game_wallet').where(filter).first();
  };

  
  const getCompleteWallet = async (gameUserId, cashBalance) => {
    let coins = await app.db('game_wallet').where({games_users_id: gameUserId}).select('*');
    coins[coins.length] = {cashBalance: cashBalance};
    return coins;
  };

  const save = async (gameWallet) => {
    if (!gameWallet.games_users_id) throw new ValidationError('Game_User_ID é um atributo obrigatório');
    if (!gameWallet.crypto_id) throw new ValidationError('Crypto_ID é um atributo obrigatório');

    // const gameDb = await findOne({ name: crypto.name });
    // if (cryptoDb) throw new ValidationError('Name duplicado na Bd');

    return app.db('game_wallet').insert(gameWallet, ['*']);
  };

  //só preciso atualizar as coins que foram compradas, assumindo que já existem na carteira do jogador aquando o inicio do jogo. (Popular automaticamente a '0')
  const update = async (trans) => {
    let updatedUserCryptoWallet = await findOne({ games_users_id: trans.games_users_id, crypto_id: trans.crypto_id});
    updatedUserCryptoWallet.amount = Number(updatedUserCryptoWallet.amount);

    // Compra
    if(trans.amount > 0) {
      updatedUserCryptoWallet.amount += trans.amount;
    } 
    else{ // Venda
      if(updatedUserCryptoWallet.amount < Math.abs(trans.amount)) throw new ValidationError('Não tem cryptos suficientes para a transação');
      updatedUserCryptoWallet.amount += trans.amount;
    }

    return app.db('game_wallet')
      .where({ id: updatedUserCryptoWallet.id })
      .update({ amount: updatedUserCryptoWallet.amount }, '*');
  };

  // const checkTotalCrypto = async (gameUserId, cryptoID) => {
  //   const totalCrypto = await findOne({ games_users_id: gameUserId, crypto_id: cryptoID });
  //   totalCrypto.amount = Number(totalCrypto.amount);
  //   return 
  // };


  // const remove = async (id) => {
  //   const game = await app.services.game.findOne({ id: id });
  //   if (!game) throw new ValidationError('O Game não existe na BD');

  //   return app.db('games')
  //     .where({ id })
  //     .del();
  // };

  return { findAll, findOne, save, update, getCompleteWallet };
};
