const request = require('supertest');

const app = require('../../src/app');

test('Test #1 - Listar os utilizadores', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0]).toHaveProperty('firstName', 'Pedro');
    });
});
