const request = require('supertest');
const jwt = require('jwt-simple');
const moment = require('moment');
moment().format();

const app = require('../../src/app');

const email = `${Date.now()}@ipca.pt`;
const username = `${Date.now()}`;
const randomNum = `${Date.now()}`;
const startDate = new Date();
const secret = 'CdTp!DWM@202122';
const MAIN_ROUTE = '/v1/leaderboards';
const crypto = `${Date.now()}`

let userA;
let userB;
let userC;
let testGameA;
let testGameAUserA;
let testGameAUserB;
let testGameAUserC;


beforeAll(async () => {

  const users = await app.db('users').insert([
    { firstName: 'Pedro', lastName: 'Martins', username: `user1${randomNum}`, email: `user1${randomNum}@ipca.pt`, password: '12345' }, 
    { firstName: 'Telmo', lastName: 'Paiva', username: `user2${randomNum}`, email: `user2${randomNum}@ipca.pt`, password: '12345' },
    { firstName: 'Rui', lastName: 'Costa', username: `user3${randomNum}`, email: `user3${randomNum}@ipca.pt`, password: '12345' },
  ], '*');

  [userA, userB, userC] = users;
  delete userA.secret;
  delete userB.secret;
  delete userC.secret;
  userA.token = jwt.encode(userA, secret);
  userB.token = jwt.encode(userB, secret);
  userC.token = jwt.encode(userC, secret);

  const res = await app.services.game.save({ startDate: moment(startDate), endDate: moment(startDate).add(5,'minutes') });
  testGameA = { ...res[0] };
  const res2 = await app.services.gameUser.save({ user_id: userA.id, game_id: testGameA.id, cashBalance: 3000});
  testGameAUserA = { ...res2[0] };
  const res3 = await app.services.gameUser.save({ user_id: userB.id, game_id: testGameA.id, cashBalance: 5000});
  testGameAUserB = { ...res3[0] };
  const res4 = await app.services.gameUser.save({ user_id: userC.id, game_id: testGameA.id, cashBalance: 1000});
  testGameAUserC = { ...res4[0] };
});


test('Teste #16 - Obter o leaderboard de um determinado jogo', () => {
  return request(app).get(`${MAIN_ROUTE}/${testGameA.id}`)
    .set('authorization', `bearer ${userA.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body[0].game_id).toBe(testGameA.id);
      expect(res.body[1].cashBalance).toBe('3000.00');
      expect(parseFloat(res.body[2].cashBalance)).toBeLessThan(parseFloat(res.body[1].cashBalance));
    });
});
