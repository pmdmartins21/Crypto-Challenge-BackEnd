const request = require('supertest');
const app = require('../../src/app');

const email = `${Date.now()}@ipca.pt`;
const username = `${Date.now()}`;


test('Teste #11.1 - Receber token ao autenticar', () => {
  return app.services.user.save(
    { firstName: 'Pedro', lastName: 'Auth', username: username, password: '12345', email: email, },
  ).then(() => request(app).post('/auth/signin')
    .send({ username: username, password: '12345' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
});

test('Teste #11.2 - Tentativa de autenticaçao errada', () => {
  const wrongUsername = `${Date.now()}`;
  return app.services.user.save(
    { firstName: 'Pedro', lastName: 'Auth', email: `${Date.now()}@ipca.pt`, username: wrongUsername, password: '12345' },
    ).then(() => request(app).post('/auth/signin')
    .send({ username: wrongUsername, password: '67890' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Autenticação Inválida!');
    });
});

test('Teste #11.3 - Tentativa de autenticaçao com utilizador errado', () => {
  const invalidUsername = `${Date.now()}`;
  return request(app).post('/auth/signin')
    .send({ username: invalidUsername, password: '67890' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Autenticação Inválida! #2');
    });
});

test('Teste #11.4 - Aceder a rotas protegidas', () => {
  return request(app).get('/v1/users')
    .then((res) => {
      expect(res.status).toBe(401);
    });
});


test('Teste #12 - Criar utilizador', () => {
  const newUsername = `${Date.now()}`;
  return request(app).post('/auth/signup')
    .send({ firstName: 'Pedro', lastName: 'Signup', email: `${Date.now()}@ipca.pt`, username: newUsername, password: '12345' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.firstName).toBe('Pedro');
      expect(res.body.lastName).toBe('Signup');
      expect(res.body).toHaveProperty('email');
      expect(res.body).not.toHaveProperty('password');
  });
});

