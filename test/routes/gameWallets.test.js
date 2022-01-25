const request = require('supertest');
const jwt = require('jwt-simple');
const moment = require('moment');
moment().format();
const dotenv = require('dotenv');
dotenv.config();

const app = require('../../src/app');

const username = `${Date.now()}`;
const email = `${Date.now()}@ipca.pt`;
const startDate = new Date();
const secret = process.env.jwtSecret;
const MAIN_ROUTE = '/v1/gameWallet';

let testGame;
let user;
let testGameUser;

beforeAll(async () => {
  const res = await app.services.user.save({ firstName: 'Pedro', lastName: 'Martins321', username: username, email:email, password: '12345' });
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
  const res2 = await app.services.game.save({ startDate: moment(startDate), endDate: moment(startDate).add(5,'minutes') });
  testGame = { ...res2[0] };
  const res3 = await app.services.gameUser.save({ user_id: user.id, game_id: testGame.id});
  testGameUser = { ...res3 };
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

test('Test 17.3.1 -Salvar Game_wallet Sem Game_User_ID', () => {
    return app.services.gameWallet.save({
      games_users_id: null,
      crypto_id: 1,
      amount: 0,
    })
    .catch((err) => {
      expect(err.name).toBe('validationError');
      expect(err.message).toBe('Game_User_ID é um atributo obrigatório');
    })
});

test('Test 17.3.2 -Salvar Game_wallet Sem crypto_id', () => {
  return app.services.gameWallet.save({
    games_users_id: testGameUser.id,
    crypto_id: null,
    amount: 0,
  })
  .catch((err) => {
    expect(err.name).toBe('validationError');
    expect(err.message).toBe('Crypto_ID é um atributo obrigatório');
  })
});
