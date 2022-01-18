const request = require('supertest');
const jwt = require('jwt-simple');
const moment = require('moment');
moment().format();

const app = require('../../src/app');

const username = `${Date.now()}`;
const email = `${Date.now()}@ipca.pt`;
const startDate = new Date();
const secret = 'CdTp!DWM@202122';
const MAIN_ROUTE = '/v1/gameWallet';
const crypto = `${Date.now()}`

let testGame;
let user;
let testCrypto;
let testGameUser;
//só o proprio user pode ver items da carteira com o seu id

beforeAll(async () => {
  const res = await app.services.user.save({ firstName: 'Pedro', lastName: 'Martins321', username: username, email:email, password: '12345' });
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
  const res2 = await app.services.game.save({ startDate: moment(startDate), endDate: moment(startDate).add(5,'minutes') });
  testGame = { ...res2[0] };
  const res3 = await app.services.gameUser.save({ user_id: user.id, game_id: testGame.id});
  testGameUser = { ...res3 };
  const res4 = await app.services.crypto.save({ name: crypto });
  testCrypto = { ...res4[0] };
});

test('Test #17.1 - Obter a gameWallet de um utilizador', () => {
  return request(app).get(`${MAIN_ROUTE}/${testGameUser.id}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).not.toHaveLength(0);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0].amount).toBe('0.00');
      expect(res.body[res.body.length - 1]).toHaveProperty('cashBalance');
    });
});

test('Test #17.2 - Obter as coins de outros utilizadores', async() => {
  const newRes = await app.services.user.save({ firstName: 'Account', lastName: 'Invalid', email: `${Date.now()}@ipca.pt`, username: `${Date.now()}`, password: '12345'});
  invalidUser = { ...newRes[0] };
  invalidUser.token = jwt.encode(invalidUser, secret);

  return request(app).get(`${MAIN_ROUTE}/${testGameUser.id}`)
      .set('authorization', `bearer ${invalidUser.token}`)
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Não tem acesso ao recurso solicitado');
    });
});
