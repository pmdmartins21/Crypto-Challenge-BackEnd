const ValidationError = require('../errors/validationError');

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

  return { findAll, findOne, save, update, remove };
};
