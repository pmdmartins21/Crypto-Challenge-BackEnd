const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const username = `${Date.now()}`;
const secret = 'CdTp!DWM@202122';
const MAIN_ROUTE = '/v1/leaderboards';

let user;


beforeAll(async () => {
  const res = await app.services.user.save({ firstName: 'Pedro', lastName: 'Martins', username: username, password: '12345' });
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
});


test('Teste #13 - Obter o leaderboard de um determinado jogo', () => {
  return app.db('games_users').insert(
    {users_id: user.id, game_id: testGame.id, cash: 20000 }, ['id'],
    )
    .then((game_user) => app.db('leaderboards').insert(
      {game_user_id: game_user.id , finalCashBalance: game_user.cash }
    )
    .then(() => request(app).get(`${MAIN_ROUTE}/${testGame.id}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body[0].game_user_id).toBe(game_user.id);
      expect(res.body[0].finalCashBalance).toBe(20000);
    })));
});
