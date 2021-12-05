const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const secret = 'CdTp!DWM@202122';
const MAIN_ROUTE = '/v1/cryptos';

let user;
let userAdmin = {
  firstName: 'Pedro',
  lastName: 'Martins',
  username: 'admin',
  password: 'admin',
  email: 'admin@cryptochallenge.com'
};

//Apenas aceitar adicionar crypto's pelo admin
beforeAll(async () => {
  const res = await app.services.user.save(userAdmin);
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
});


test('Test #3 - Listar todas as cryptos', () => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).not.toHaveLength(0);
      expect(res.body[0]).toHaveProperty('name');
    });
});

test('Test #4 - Inserir crypto', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
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
    .then(() => request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .send({ name: 'Crypto Dup' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Name duplicado na Bd');
    });
});

test('Test #6 - Remover Crypto', () => {
  return app.db('cryptos')
    .insert({ name: 'Crypto to Remove' }, ['id'])
    .then((crypto) => request(app).delete(`${MAIN_ROUTE}/${crypto[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({ name: 'Crypto Removed' }))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
test('Test #6 - Alterar Crypto por ID', () => {
  return app.db('cryptos')
    .insert({ name: 'Crypto - Update'}, ['id'])
    .then((crypto) => request(app).put(`${MAIN_ROUTE}/${crypto[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({ name: 'Crypto Updated' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Crypto Updated');
    });
});

//alterar crypto sem ser admin