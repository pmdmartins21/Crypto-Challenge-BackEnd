const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const username = `${Date.now()}`;
const secret = 'CdTp!DWM@202122';
const MAIN_ROUTE = '/v1/users';

let user;


beforeAll(async () => {
  const res = await app.services.user.save({ firstName: 'Pedro', lastName: 'Martins', username: username, password: '12345' });
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
});


test('Teste #13 - Obter o leaderboard de um determinado jogo', () => {});

