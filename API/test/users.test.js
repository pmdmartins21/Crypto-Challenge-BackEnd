const request = require('supertest');

const app = require('../src/app');

test('Test #1 - Listar os utilizadores', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toHaveProperty('name', 'Pedro Martins');
    });
});

test('Test #2 - Inserir utilizadores', () => {
  return request(app).post('/users')
    .send({ name: 'Pedro Martins', mail: 'a20630@alunos.ipca.pt', id: '12345' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Pedro Martins');
    });
});
