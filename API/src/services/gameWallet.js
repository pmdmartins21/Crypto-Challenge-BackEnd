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

  //só preciso atualizar as coins que foram compradas, assumindo que já existem na carteira do jogador aquando o inicio do jogo. (Popular automaticamente a '0')
  //cryptoAmmount é positivo para compras, negativo para vendas
  const update = async (gameUserId, cryptoAmmount, cryptoID) => {
    let updatedUserCryptoWallet = await findOne({ games_users_id: gameUserId, crypto_id: cryptoID});
    updatedUserCryptoWallet.amount = Number(updatedUserCryptoWallet.amount);

    if(cryptoAmmount > 0) {
      updatedUserCryptoWallet.amount += cryptoAmmount;
    } 
    else{
      if(updatedUserCryptoWallet.amount < Math.abs(cryptoAmmount)) throw new ValidationError('Não tem cryptos suficientes para a transação');
      updatedUserCryptoWallet.amount += cryptoAmmount;
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

  return { findAll, findOne, save, update };
};
