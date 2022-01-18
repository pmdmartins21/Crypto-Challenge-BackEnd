const request = require('supertest');
const jwt = require('jwt-simple');
const moment = require('moment');
moment().format();

const app = require('../../src/app');

const username = `${Date.now()}`;
const email = `${Date.now()}@ipca.pt`;
const startDate = new Date();
const secret = 'CdTp!DWM@202122';
const MAIN_ROUTE = '/v1/gamesUsers';

let testGame;
let user;

beforeAll(async () => {
  const res = await app.services.user.save({ firstName: 'Pedro', lastName: 'Martins', username: username, email:email, password: '12345' });
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
  const res2 = await app.services.game.save({ startDate: moment(startDate), endDate: moment(startDate).add(5,'minutes') });
  testGame = { ...res2[0] };
});

test('Teste #18 - Testar a inscrição de um jogador num jogo', async () => {
  return request(app).post(`${MAIN_ROUTE}/${testGame.id}/${user.id}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.game_id).toBe(testGame.id);
      expect(res.body.cashBalance).toBe('50000.00');
    });
});