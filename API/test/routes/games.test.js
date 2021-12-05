const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const secret = 'CdTp!DWM@202122';
const MAIN_ROUTE = '/v1/games';
const startDate = Date.now();

let user;
let userAdmin = {
  firstName: 'Pedro',
  lastName: 'Martins',
  username: 'admin',
  password: 'admin',
  email: 'admin@cryptochallenge.com'
};



//Apenas o admin pode criar jogos
beforeAll(async () => {
  const res = await app.services.user.save(userAdmin);
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
});

test('Teste #13 - Criar um novo jogo', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({
      startDate: startDate, endDate: Date.now()
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.startDate).toBe(startDate);
    });
});
test('Teste #13 - Listar um jogo especifico', () => {
  
});
test('Teste #13 - definir o inicio-fim do jogo', () => {});