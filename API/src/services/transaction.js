const ValidationError = require('../errors/validationError');
const Transaction = require('../../src/models/transaction');

module.exports = (app) => {

  
  const findAll = async ( filter = {}) => {

    //get all games from this user
    let gamesFromUser = await app.services.gameUser.findAllGameUsersID({user_id: filter.id});
    let gamesIds = [];
    for(let i = 0; i < gamesFromUser.length; i++) {
      gamesIds.push(gamesFromUser[i].id);
    };

    return app.db('transactions')
      .whereIn('games_users_id', gamesIds)
      .select('*');
  };

  // const findOne = (filter = {}) => {
  //   return app.db('transactions')
  //     .where(filter)
  //     .first();
  // };

  const save = async (trans) => {
    // if (!trans.desc) throw new ValidationError('A DESCRIÇÃO é um atributo obrigatório');
    // if (!trans.ammount) throw new ValidationError('O VALOR é um atributo obrigatório');
    // if (!trans.date) throw new ValidationError('A DATA é um atributo obrigatório');
    // if (!trans.acc_id) throw new ValidationError('A CONTA é um atributo obrigatório');
    // if (!trans.type) throw new ValidationError('O TIPO é um atributo obrigatório');
    // if (!(trans.type === 'I' || trans.type === 'O')) throw new ValidationError('O TIPO tem um valor inválido');

    //update game user
    await app.services.gameUser.update(trans);
    //update game wallet
    await app.services.gameWallet.update(trans);

    const newTrans = { ...trans };
    if ((trans.type === 'B' && trans.ammount < 0)
      || (trans.type === 'S' && trans.ammount > 0)) {
      newTrans.amount *= -1;
    }

    return app.db('transactions')
      .insert(newTrans, '*');
  };

  const update = (id, trans) => {
    return app.db('transactions')
      .where({ id })
      .update(trans, '*');
  };

  const remove = (id) => {
    return app.db('transactions')
      .where({ id })
      .del();
  };

  return {
    save, update, remove, findAll
  };
};
