const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const username = `${Date.now()}`;
const secret = 'CdTp!DWM@202122';
const MAIN_ROUTE = '/v1/wallets';

let user;
//só o proprio user pode ver items da carteira com o seu id

beforeAll(async () => {
  const res = await app.services.user.save({ firstName: 'Pedro', lastName: 'Martins', username: username, password: '12345' });
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
  
});

test('Test #5 - Obter as coins de um utilizador', (user) => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).not.toHaveLength(0);
      expect(res.body[0]).toHaveProperty('firstName');
    });
});

test('Test #5 - Obter as coins de outros utilizadores', (user) => {});


