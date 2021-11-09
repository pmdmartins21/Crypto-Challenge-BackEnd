module.exports = (app) => {
  const findAll = (req, res) => {
    const users = [
      { firstName: 'Pedro', mail: 'a20630@alunos.ipca.pt', id: '12345' },
    ];
    res.status(200).json(users);
  };

  return { findAll };
};
