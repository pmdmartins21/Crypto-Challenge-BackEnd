module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('users').where(filter).select('*');
  };

  return { findAll };
};
