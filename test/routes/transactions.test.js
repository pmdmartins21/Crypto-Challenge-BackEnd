const request = require('supertest');
const jwt = require('jwt-simple');
const moment = require('moment');
moment().format();
const dotenv = require('dotenv');
dotenv.config();

const app = require('../../src/app');

const randomNum = `${Date.now()}`;
const startDate = new Date();
const secret = process.env.jwtSecret;
const MAIN_ROUTE = '/v1/transactions';
const crypto = { id: 1, name: 'Bitcoin'};

let userA;
let userB;
let userC;
let testGameA;
let testGameB;
let testGameAUserA;
let testGameAUserB;
let testGameBUserA;



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
  const res2 = await app.services.gameUser.save({ user_id: userA.id, game_id: testGameA.id});
  testGameAUserA = { ...res2 };
  const res3 = await app.services.gameUser.save({ user_id: userB.id, game_id: testGameA.id});
  testGameAUserB = { ...res3 };
  const res4 = await app.services.game.save({ startDate: moment(startDate), endDate: moment(startDate).add(5,'minutes') });
  testGameB = { ...res4[0] };
  const res5 = await app.services.gameUser.save({ user_id: userA.id, game_id: testGameB.id});
  testGameBUserA = { ...res5 };
});

test('Teste #19.1 -Inserir uma transação de compra', () => {
    const transaction = 
    { games_users_id: testGameAUserA.id, crypto_id: crypto.id, date: new Date(),  type: 'B', amount: 5, crypto_value: 100 }; 
    
    return request(app).post(`${MAIN_ROUTE}`)
      .set('authorization', `bearer ${userA.token}`)
      .send(transaction)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('crypto_value');

        expect(res.body.type).toBe('B');
        expect(res.body.amount).toBe('5.00');
      });
});

test('Teste #19.2 -Inserir uma transação de venda', () => {
  const transaction2 = 
    { games_users_id: testGameAUserA.id, crypto_id: crypto.id, date: new Date(),  type: 'S', amount: -2, crypto_value: 100 };
    
    return request(app).post(`${MAIN_ROUTE}`)
      .set('authorization', `bearer ${userA.token}`)
      .send(transaction2)
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('crypto_value');
        expect(res.body.type).toBe('S');
        expect(res.body.amount).toBe('-2.00');
      });
});

test('Teste #19.3.1 -Tentar uma compra sem saldo suficiente', () => {
  const transaction3 = 
    { games_users_id: testGameAUserA.id, crypto_id: crypto.id, date: new Date(),  type: 'B', amount: 5000, crypto_value: 100 };
    
    return request(app).post(`${MAIN_ROUTE}`)
      .set('authorization', `bearer ${userA.token}`)
      .send(transaction3)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Não tem saldo suficiente para a transação');
      });
});

test('Teste #19.3.2 -Tentar uma venda sem cryptos suficientes', () => {
  const transaction4 = 
    { games_users_id: testGameAUserA.id, crypto_id: crypto.id, date: new Date(),  type: 'S', amount: -5000, crypto_value: 100 };
    
    return request(app).post(`${MAIN_ROUTE}`)
      .set('authorization', `bearer ${userA.token}`)
      .send(transaction4)
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Não tem cryptos suficientes para a transação');
      });
});

test('Teste #19.4 - Listar todas as transaçoes de utilizador', () => { //TODO confirmar se é preciso o insert
  return app.db('game_wallet').insert({
    games_users_id: testGameBUserA.id, crypto_id: crypto.id, amount: 0 
  }).then(() => 
    request(app).post(`${MAIN_ROUTE}`)
      .set('authorization', `bearer ${userA.token}`)
      .send(
        { games_users_id: testGameBUserA.id, crypto_id: crypto.id, date: new Date(),  type: 'B', amount: 5, crypto_value: 100 }
      )
      .then(() => request(app).get(`${MAIN_ROUTE}/all/${userA.id}`)
      .set('authorization', `bearer ${userA.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(3);
        expect(res.body[1].type).toBe('S');
        expect(res.body[0].amount).toBe('5.00');
      }))); 
});

test('Teste #19.5 - Aceder a transaçoes de outro utilizador', () => {
  return request(app).get(`${MAIN_ROUTE}/all/${userA.id}`)
    .set('authorization', `bearer ${userB.token}`)
    .then((res) => {
      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Não tem acesso ao recurso solicitado');
    })
});

test('Teste #20.1 - Inserir Transação de um utilizador', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${userA.token}`)
    .send({
      games_users_id: testGameAUserA.id, crypto_id: crypto.id, date: new Date(),  type: 'B', amount: 5, crypto_value: 100 
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
    games_users_id: testGameAUserA.id, crypto_id: crypto.id, date: new Date(),  type: 'B', amount: 5, crypto_value: 100
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
      games_users_id: testGameAUserA.id, crypto_id: crypto.id, date: new Date(),  type: 'S', amount: -2, crypto_value: 100
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.games_users_id).toBe(testGameAUserA.id);
      expect(res.body.amount).toBe('-2.00');
    });
});

// validar todos os campos
describe(' 20.4 Validação de criar uma transação', () => {
  const testTemplate = (newData, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${userA.token}`)
      .send({
        games_users_id: testGameAUserA.id, crypto_id: crypto.id, date: new Date(),  type: 'B', amount: 5, crypto_value: 100, ...newData,
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Test 20.4.1 - Sem Game_User_ID', () => testTemplate({ games_users_id: null }, 'O GAME_USER_ID é um atributo obrigatório'));
  test('Test 20.4.2 - Sem Crypto_ID', () => testTemplate({ crypto_id: null }, 'O Crypto_ID é um atributo obrigatório'));
  test('Test 20.4.3 - Sem Data', () => testTemplate({ date: null }, 'A DATA é um atributo obrigatório'));
  test('Test 20.4.4 - Sem Tipo', () => testTemplate({ type: null }, 'O TIPO é um atributo obrigatório'));
  test('Test 20.4.5 - Com Tipo errado', () => testTemplate({ type: 'P' }, 'O TIPO tem um valor inválido'));
  test('Test 20.4.6 - Sem Amount', () => testTemplate({ amount: null }, 'O AMOUNT é um atributo obrigatório'));
  test('Test 20.4.7 - Sem o valor da crypto', () => testTemplate({ crypto_value: null }, 'O VALOR DA CRYPTO é um atributo obrigatório'));
});

test('Teste #21 - Listar uma transaçao', () => {
  return app.db('transactions').insert(
    { games_users_id: testGameAUserA.id, crypto_id: crypto.id, date: new Date(),  type: 'B', amount: 5, crypto_value: 100 }, ['id'],
  ).then((trans) => request(app).get(`${MAIN_ROUTE}/${trans[0].id}`)
    .set('authorization', `bearer ${userA.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(trans[0].id);
      expect(res.body.games_users_id).toBe(testGameAUserA.id);
    }));
});