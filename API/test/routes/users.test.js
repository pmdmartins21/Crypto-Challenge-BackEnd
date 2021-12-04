const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const username = `${Date.now()}`;
const secret = 'ipca!DWM@202122';
const MAIN_ROUTE = '/v1/users';

let user;


beforeAll(async () => {
  const res = await app.services.user.save({ firstName: 'Pedro', lastName: 'Martins', username: username, password: '12345' });
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
});

test('Test #1 - Listar os utilizadores', () => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).not.toHaveLength(0);
      expect(res.body[0]).toHaveProperty('firstName');
    });
});

test('Test #2 - Inserir utilizadores', () => {
  return request(app).post(MAIN_ROUTE)
  .set('authorization', `bearer ${user.token}`)
    .send({
      firstName: 'João',
      lastName: 'Manuel',
      username: `${Date.now()}`,
      password: '12345',
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.firstName).toBe('João');
      expect(res.body).not.toHaveProperty('password');
    });
});
