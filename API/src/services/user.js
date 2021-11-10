const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('users').where(filter).select('*');
  };

  const findOne = (filter = {}) => {
    return app.db('users').where(filter).first();
  };

  const save = async (user) => {
    if (!user.firstName) throw new ValidationError('Nome é um atributo obrigatório');
    if (!user.lastName) throw new ValidationError('O email é um atributo obrigatório');
    if (!user.password) throw new ValidationError('A palavra passe é um atributo obrigatório');
    if (!user.username) throw new ValidationError('Username é um atributo obrigatório');

    const userDb = await findOne({ username: user.username });
    if (userDb) throw new ValidationError('Email duplicado na Bd');

    return app.db('users').insert(user, ['id', 'firstName', 'lastName', 'username', 'password']);
  };

  return { findAll, save };
};
