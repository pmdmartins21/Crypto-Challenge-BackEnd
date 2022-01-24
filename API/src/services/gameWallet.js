const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findOne = (filter = {}) => {
    return app.db('game_wallet').where(filter).first();
  };
  
  const getCompleteWallet = async (gameUserId, cashBalance) => {
    let wallet = await app.db('game_wallet')
    .innerJoin('cryptos', 'cryptos.id', 'game_wallet.crypto_id')
    .where({games_users_id: gameUserId})
    .select('cryptos.id', 'cryptos.name', 'game_wallet.amount');

    wallet[wallet.length] = {cashBalance: cashBalance};
    return wallet;
  };

  const save = async (gameWallet) => {
    if (!gameWallet.games_users_id) throw new ValidationError('Game_User_ID é um atributo obrigatório');
    if (!gameWallet.crypto_id) throw new ValidationError('Crypto_ID é um atributo obrigatório');

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

  return { findOne, save, update, getCompleteWallet };
};
