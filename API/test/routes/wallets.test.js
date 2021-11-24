const request = require('supertest');

const app = require('../../src/app');
const wallets = require('../../src/routes/wallets');

const MAIN_ROUTE = '/wallets';

const user = `${Date.now()}`;

test('Test #1 - criacao de Wallet', () => {
  return request(app).post(MAIN_ROUTE)
    .send({
      cryptold: 1,
      amount: 2.2,
      user_id: 2,
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.amount).toBe(2.2);
    });
});
