module.exports = (app) => {
  const save = (wallet) => {
    return app.db('wallets')
      .insert(wallet, '*');
  };

  return { save };
};
