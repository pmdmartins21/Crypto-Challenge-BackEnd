const request = require('supertest');
const jwt = require('jwt-simple');
const moment = require('moment');
moment().format();


const app = require('../../src/app');

const secret = 'CdTp!DWM@202122';
const MAIN_ROUTE = '/v1/cryptos';

const username = `${Date.now()}`;
const email = `${Date.now()}@gmail.com`;
const cryptoToUpdate = `${Date.now()}`;
const startDate = new Date();

let user;
let testGame;


//Apenas aceitar adicionar crypto's pelo admin

beforeAll(async () => {
  const res = await app.services.user.save({ firstName: 'Pedro', lastName: 'Martins', username: username, password: '12345', email: email });
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
  const res2 = await app.services.game.save({ startDate: moment(startDate), endDate: moment(startDate).add(5,'minutes') });
  testGame = { ...res2[0] };
});


test('Test #6 - Listar todas as cryptos', () => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).not.toHaveLength(0);
      expect(res.body[0]).toHaveProperty('name');
    });
});

// test('Test #7 - Inserir crypto', () => {
//   const cryptoName = `${Date.now()}`;

//   return request(app).post(MAIN_ROUTE)
//     .set('authorization', `bearer ${user.token}`)
//     .send({
//       name: cryptoName,
//     })
//     .then((res) => {
//       expect(res.status).toBe(201);
//       expect(res.body.name).toBe(cryptoName);
//     });
// });

// test('Test #7.1 - Inserir nome de Crypto duplicado', () => {
//   const cryptoDuplicated = `${Date.now()}`;
//   return app.db('cryptos')
//     .insert({ name: cryptoDuplicated })
//     .then(() => request(app).post(MAIN_ROUTE)
//       .set('authorization', `bearer ${user.token}`)
//       .send({ name: cryptoDuplicated }))
//     .then((res) => {
//       expect(res.status).toBe(400);
//       expect(res.body.error).toBe('Name duplicado na Bd');
//     });
// });

// test('Test #8 - Alterar Crypto por ID', () => {
//   const cryptoUpdated = `${Date.now()}`;
//   return app.db('cryptos')
//     .insert({ name: cryptoToUpdate}, ['id'])
//     .then((crypto) => request(app).put(`${MAIN_ROUTE}/${crypto[0].id}`)
//       .set('authorization', `bearer ${user.token}`)
//       .send({ name: cryptoUpdated }))
//     .then((res) => {
//       expect(res.status).toBe(200);
//       expect(res.body.name).toBe(cryptoUpdated);
//     });
// });

// test('Test #9 - Remover Crypto', () => {
//   const cryptoToRemove = `${Date.now()}`;

//   return app.db('cryptos')
//     .insert({ name: cryptoToRemove }, ['id'])
//     .then((crypto) => request(app).delete(`${MAIN_ROUTE}/${crypto[0].id}`)
//       .set('authorization', `bearer ${user.token}`)
//       .send({ name: 'Crypto Removed' }))
//     .then((res) => {
//       expect(res.status).toBe(204);
//     });
// });

// test('Teste #10 - Listar uma Crypto por id', () => {
//   const cryptoToGet = `${Date.now()}`;

//   return app.db('cryptos')
//     .insert({ name: cryptoToGet}, ['id'])
//     .then((crypto) => request(app).get(`${MAIN_ROUTE}/${crypto[0].id}`)
//       .set('authorization', `bearer ${user.token}`))
//     .then((res) => {
//       expect(res.status).toBe(200);
//       expect(res.body.name).toBe(cryptoToGet);
//     });
// });
//alterar crypto sem ser admin

test('Teste #10.1 - Obter a timeseries de uma crypto por id/ponto_de_inicio', () => 
{
  return request(app).get(`${MAIN_ROUTE}/timeSeries/${testGame.id}`)
      .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body[0].length).toBe(300);
    });
});