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
let userB;

beforeAll(async () => {
  const res = await app.services.user.save({ firstName: 'Pedro', lastName: 'Martins', username: username, email:email, password: '12345' });
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
  const res2 = await app.services.game.save({ startDate: moment(startDate), endDate: moment(startDate).add(5,'minutes') });
  testGame = { ...res2[0] };
  const res3 = await app.services.user.save({ firstName: 'Telmo', lastName: 'Paiva', username: `${username}1`, email: `${email}1`, password: '12345' });
  userB = { ...res3[0] };
  userB.token = jwt.encode(userB, secret);
});

test('Teste #18.1 - Testar a inscrição de um jogador num jogo', () => {
  return request(app).post(`${MAIN_ROUTE}/${user.id}`)
    .set('authorization', `bearer ${user.token}`)
    .send({
      game_id: testGame.id, user_id: user.id
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.game_id).toBe(testGame.id);
      expect(res.body.cashBalance).toBe('50000.00');
    });
});

test('Teste #18.2 - Testar a inscrição de um jogador num jogo com um id diferente do dele', async () => {
  return request(app).post(`${MAIN_ROUTE}/${user.id}`)
    .set('authorization', `bearer ${userB.token}`)
    .send({
      game_id: testGame.id, user_id: userB.id
    })
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Não tem acesso ao recurso solicitado');
    });
});

describe(' Test 18.3 - Validação de inscrição de um user', () => {
  const testTemplate = (newData, errorMessage) => {
    return request(app).post(`${MAIN_ROUTE}/${user.id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({
        game_id: testGame.id, user_id: user.id , ...newData,
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Test 18.3.1 - Sem First Name', () => testTemplate({ game_id: null }, 'GAME_ID é um atributo obrigatório'));
  test('Test 18.3.2 - Sem Last Name', () => testTemplate({ user_id: null }, 'USER_ID é um atributo obrigatório'));
});