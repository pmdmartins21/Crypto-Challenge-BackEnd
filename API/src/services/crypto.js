const ValidationError = require('../errors/validationError');
const coins = [
  'bitcoin',
  'ethereum',
  'cardano',
  'dogecoin'
];

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('cryptos').where(filter).select('*');
  };

  const findOne = (filter = {}) => {
    return app.db('cryptos').where(filter).first();
  };

  const save = async (crypto) => {
    if (!crypto.name) throw new ValidationError('Name é um atributo obrigatório');

    const cryptoDb = await findOne({ name: crypto.name });
    if (cryptoDb) throw new ValidationError('Name duplicado na Bd');

    return app.db('cryptos').insert(crypto, ['id', 'name']);
  };

  const update = (id, crypto) => {
    return app.db('cryptos')
      .where({ id })
      .update(crypto, '*');
  };

  const remove = async (id) => {
    const crypto = await app.services.crypto.findOne({ id: id });
    if (!crypto) throw new ValidationError('A Crypto não existe na BD');

    return app.db('cryptos')
      .where({ id })
      .del();
  };

  const getCryptoTimeSeries = async (game_id) => {
    const game = await app.services.game.findOne({ id: parseInt(game_id) });
    if (!game) throw new ValidationError('O jogo não existe na BD');

    //loop para ir buscar a timeserie de cada uma das 4 moedas(BTC,ETH,ADA,DOGE)
    let { bitcoin_starting_point } = game;
    let { ethereum_starting_point } = game;
    let { cardano_starting_point } = game;
    let { dogecoin_starting_point } = game;
    let points = [bitcoin_starting_point, ethereum_starting_point, cardano_starting_point, dogecoin_starting_point];
    let coinsData = [];

    for( let i = 0; i < coins.length; i++) {
      let data =  await app.db(coins[i])
        .where( 'sno', '>=', points[i])
        .orderBy('sno')
        .limit(300)
        .select('*');

      coinsData.push(data);
    };

    return coinsData;
  }; 

  return { findAll, findOne, save, update, remove, getCryptoTimeSeries };
};
