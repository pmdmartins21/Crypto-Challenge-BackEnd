const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const email = `${Date.now()}@ipca.pt`;
const username = `${Date.now()}`;
const startDate = Date.now();
const secret = 'CdTp!DWM@202122';
const MAIN_ROUTE = '/v1/transactions';
const crypto = `${Date.now()}`

let userA;
let userB;
let userC;
let testGameA;
let testGameAUserA;
let testGameAUserB;
let testGameAUserC;
let testCrypto;


beforeAll(async () => {

  await app.db('transactions').del();
  await app.db('games_users').del();
  await app.db('games').del();
  await app.db('users').del();
  await app.db('cryptos').del();

  const users = await app.db('users').insert([
    { firstName: 'Pedro', lastName: 'Martins', username: 'user1', email: 'user1@ipca.pt', password: '12345' }, 
    { firstName: 'Telmo', lastName: 'Paiva', username: 'user2', email: 'user2@ipca.pt', password: '12345' },
    { firstName: 'Rui', lastName: 'Costa', username: 'user3', email: 'user3@ipca.pt', password: '12345' },
  ], '*');

  [userA, userB, userC] = users;
  delete userA.secret;
  delete userC.secret;
  userA.token = jwt.encode(userA, secret);
  userC.token = jwt.encode(userC, secret);

  const res2 = await app.services.game.save({ startDate: startDate, endDate: Date.now() });
  testGameA = { ...res2[0] };
  const res3 = await app.services.gameUsers.save({ user_id: userA.id, game_id: testGameA.id});
  testGameAUserA = { ...res3[0] };
  const res3 = await app.services.gameUsers.save({ user_id: userB.id, game_id: testGameA.id});
  testGameAUserB = { ...res3[0] };
  const res4 = await app.services.crypto.save({ name: crypto });
  testCrypto = { ...res4[0] };
});

test('Teste #19.1 - Listar todas as transaçoes de utilizador', () => {
  return app.db('transactions').insert([
    { games_users_id: testGameAUserA.id, crypto_id: testCrypto.id, date: new Date(),  type: 'B', amount: 5, crypto_value: 100 },
    { games_users_id: testGameAUserA.id, crypto_id: testCrypto.id, date: new Date(),  type: 'S', amount: -2, crypto_value: 100 },
    { games_users_id: testGameAUserB.id, crypto_id: testCrypto.id, date: new Date(),  type: 'S', amount: -5, crypto_value: 100 },
  ]).then(() => request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${userA.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].desc).toBe('B');
      expect(res.body[0].amount).toBe(5);
    }));
});

test('Teste #19.2 - Aceder a transaçoes de outro utilizador', () => {
  return app.db('transactions').insert(
    { games_users_id: testGameAUserB.id, crypto_id: testCrypto.id, date: new Date(),  type: 'B', amount: 5, crypto_value: 100 }, ['id'],
  ).then((trans) => request(app).get(`${MAIN_ROUTE}/${trans[0].id}`)
    .set('authorization', `bearer ${userA.token}`)
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Não tem acesso ao recurso solicitado');
    }));
});

test('Teste #20.1 - Inserir Transação de um utilizador', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({
      games_users_id: testGameAUserA.id, crypto_id: testCrypto.id, date: new Date(),  type: 'B', amount: 5, crypto_value: 100 
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.games_users_id).toBe(testGameAUserA.id);
      expect(res.body.type).toBe('B');
    });
});



test('Teste #20.2 - Transaçoes de compra devem ser positivas', () => {
  return request(app).post(MAIN_ROUTE)
  .set('authorization', `bearer ${userA.token}`)
  .send({
    games_users_id: testGameAUserA.id, crypto_id: testCrypto.id, date: new Date(),  type: 'B', amount: 5, crypto_value: 100
  })
  .then((res) => {
    expect(res.status).toBe(201);
    expect(res.body.games_users_id).toBe(testGameAUserA.id);
    expect(res.body.amount).toBe('5.00');
  });
});
test('Teste #20.3 -Transaçoes de venda devem ser negativas', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${userA.token}`)
    .send({
      games_users_id: testGameAUserA.id, crypto_id: testCrypto.id, date: new Date(),  type: 'S', amount: -2, crypto_value: 100
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.games_users_id).toBe(testGameAUserA.id);
      expect(res.body.amount).toBe('-2.00');
    });
});

//validar todos os campos
describe(' 20.4 Validação de criar uma transação', () => {
  const testTemplate = (newData, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${userA.token}`)
      .send({
        games_users_id: testGameAUserC.id, crypto_id: testCrypto.id, date: new Date(),  type: 'B', amount: 5, crypto_value: 100, ...newData,
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Test 20.4.1 - Sem Game_User_ID', () => testTemplate({ games_users_id: null }, 'O GAME_USER é um atributo obrigatório'));
  test('Test 20.4.2 - Sem Crypto_ID', () => testTemplate({ crypto_id: null }, 'O Crypto_ID é um atributo obrigatório'));
  test('Test 20.4.3 - Sem Data', () => testTemplate({ date: null }, 'A DATA é um atributo obrigatório'));
  test('Test 20.4.4 - Sem Tipo', () => testTemplate({ type: null }, 'O TIPO é um atributo obrigatório'));
  test('Test 20.4.5 - Com Tipo errado', () => testTemplate({ type: 'P' }, 'O TIPO tem um valor inválido'));
  test('Test 20.4.6 - Sem Amount', () => testTemplate({ amount: null }, 'O AMOUNT é um atributo obrigatório'));
  test('Test 20.4.7 - Sem o valor da crypto', () => testTemplate({ crypto_value: null }, 'O VALOR DA CRYPTO é um atributo obrigatório'));
});

test('Teste #21 - Listar uma transaçao', () => {
  return app.db('transactions').insert(
    { games_users_id: testGameAUserA.id, crypto_id: testCrypto.id, date: new Date(),  type: 'B', amount: 5, crypto_value: 100 }, ['id'],
  ).then((trans) => request(app).get(`${MAIN_ROUTE}/${trans[0].id}`)
    .set('authorization', `bearer ${userA.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(trans[0].id);
      expect(res.body.games_users_id).toBe(testGameAUserA.id);
    }));
});