const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const name = `${Date.now()}`;
const secret = 'CdTp!DWM@202122';
const MAIN_ROUTE = '/v1/cryptos';

let user;

//Apenas aceitar adicionar crypto's pelo admin
// beforeAll(async () => {
//   const res = await app.services.crypto.save({  name: name });
// });


test('Test #3 - Listar todas as cryptos', () => {
  return request(app).get('/cryptos')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).not.toHaveLength(0);
      expect(res.body[0]).toHaveProperty('name');
    });
});

test('Test #4 - Inserir crypto', () => {
  return request(app).post('/cryptos')
 // .set('authorization', `bearer ${user.token}`)
    .send({
      name: name,
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe(name);
    });
});

test('Test #5 - Inserir nome de Crypto duplicado', () => {
  return app.db('cryptos')
    .insert({ name: 'Crypto Dup' })
    .then(() => request(app).post('/cryptos')
      //.set('authorization', `bearer ${user.token}`)
      .send({ name: 'Crypto Dup' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Name duplicado na Bd');
    });
});

test('Test #6 - Remover Crypto', () => {});
test('Test #6 - Alterar Crypto', () => {});

test('Test #6 - Obter Crypto que não existe', () => {});
