const request = require('supertest');

const app = require('../../src/app');

const user = `${Date.now()}`;

test('Test #1 - Listar os utilizadores', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).not.toHaveLength(0);
      expect(res.body[0]).toHaveProperty('firstName');
    });
});

test('Test #2 - Inserir utilizadores', () => {
  return request(app).post('/users')
    .send({
      firstName: 'João',
      lastName: 'Manuel',
      username: user,
      password: '12345',
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.firstName).toBe('João');
      expect(res.body).toHaveProperty('password');
    });
});
