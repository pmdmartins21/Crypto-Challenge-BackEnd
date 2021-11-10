module.exports = (app) => {
  const findAll = (req, res) => {
    app.services.user.findAll()
      .then((result) => res.status(200).json(result));
  };

  return { findAll };
};
