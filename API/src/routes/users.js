module.exports = (app) => {
  const findAll = (req, res) => {
    const users = [
      { name: 'Pedro Martins', mail: 'a20630@alunos.ipca.pt', id: '12345' },
    ];
    res.status(200).json(users);
  };

  const create = (req, res) => {
    res.status(201).json(req.body);
  };

  return { findAll, create };
};
