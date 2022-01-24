const ValidationError = require('../errors/validationError');
const bitcoinDateEntries = 1615;
const ethereumDateEntries = 1615;
const cardanoDateEntries = 1371;
const dogecoinDateEntries = 2760;


module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('games').where(filter).select('*'); //testar
  };

  const findOne = (filter = {}) => {
    if(typeof(filter) !== 'object')  throw new ValidationError('O jogo indicado não é válido');
    return app.db('games').where(filter).first();
  };

  const save = async (game) => {

    if (!game.startDate) throw new ValidationError('StartDate é um atributo obrigatório');

    //TODO garantir que quando um user entra num jogo, que sao criadas as wallets das cryptos a 0 e é definido o ponto de inicio da sequencia das cryptos.
    var a = new Date(game.startDate);
    var b = new Date(game.endDate);
    var difference = (b - a) / 1000;
    game.totalSeconds = difference;

    game.bitcoin_starting_point = Math.round(Math.random()*(bitcoinDateEntries - game.totalSeconds));
    game.ethereum_starting_point = Math.round(Math.random()*(ethereumDateEntries - game.totalSeconds));
    game.cardano_starting_point = Math.round(Math.random()*(cardanoDateEntries - game.totalSeconds));
    game.dogecoin_starting_point = Math.round(Math.random()*(dogecoinDateEntries - game.totalSeconds));
    
    return app.db('games').insert(game, ['*']);
  };

  const update = (id, game) => {
    return app.db('games')
      .where({ id })
      .update(game, '*');
  };

  // const remove = async (id) => {
  //   const game = await app.services.game.findOne({ id: id }); //testar
  //   if (!game) throw new ValidationError('O Game não existe na BD'); //testar

  //   return app.db('games')
  //     .where({ id })
  //     .del();
  // };

  return { findAll, findOne, save, update };
};

//TODO terminar jogo => vender cryptos ao preço do ultimo valor na timeseries do jogo.