const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('users').where(filter).select(['id', 'firstName', 'lastName','email', 'username' ]);
  };

  const findOne = (filter = {}) => { //testar
    return app.db('users').where(filter).first();
  };

  const getPasswdHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const save = async (user) => {
    if (!user.firstName) throw new ValidationError('O First Name é um atributo obrigatório');
    if (!user.lastName) throw new ValidationError('O Last Name é um atributo obrigatório');
    if (!user.password) throw new ValidationError('A Password é um atributo obrigatório');
    if (!user.email) throw new ValidationError('O EMAIL é um atributo obrigatório');
    if (!user.username) throw new ValidationError('O USERNAME é um atributo obrigatório');

    const userDb = await findOne({ username: user.username });
    if (userDb) throw new ValidationError('Já existe uma conta com o username indicado');

    const userDb2 = await findOne({ email: user.email });
    if (userDb2) throw new ValidationError('Já existe uma conta com o email indicado');

    const newUser = { ...user };
    newUser.password = getPasswdHash(user.password);
    return app.db('users').insert(newUser, ['id', 'firstName', 'lastName','email', 'username' ]);
  };

  const remove = async (id) => {
    const user = await app.services.user.findOne({ id: id });
    if (!user) throw new ValidationError('O User não existe na BD'); //testar

    return app.db('users')
      .where({ id })
      .del();
  };

  const update = (id, user) => {
    return app.db('users')
      .where({ id })
      .update(user, '*');
  };

  return { findAll, save, findOne, remove, update };
};
