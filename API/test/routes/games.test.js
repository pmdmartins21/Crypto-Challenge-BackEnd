const request = require('supertest');
const jwt = require('jwt-simple');
const moment = require('moment');
moment().format();

const app = require('../../src/app');

const secret = 'CdTp!DWM@202122';
const MAIN_ROUTE = '/v1/games';
const startDate = new Date();
const username = `${Date.now()}`;
const email = `${Date.now()}@gmail.com`;

let user;
let endDate;

//Apenas o admin pode criar jogos
beforeAll(async () => {
  const res = await app.services.user.save({ firstName: 'Pedro', lastName: 'Martins', username: username, password: '12345', email: email });
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
});

test('Teste #13 - Criar um novo jogo', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({
      startDate: moment(startDate), endDate: moment(startDate).add(5,'minutes')
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(new Date(res.body.startDate)).toEqual(startDate);
    });
});
test('Teste #14 - Listar um jogo por id', () => {
  return app.db('games')
    .insert({ startDate: moment(startDate), endDate: moment(startDate).add(5,'minutes')}, ['id'])
    .then((game) => request(app).get(`${MAIN_ROUTE}/${game[0].id}`)
      .set('authorization', `bearer ${user.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(new Date(res.body.startDate)).toEqual(startDate);
    });
});

test('Teste #15 - definir o inicio-fim do jogo', () => {
  const newStartDate = new Date();
  const newEndDate = moment(newStartDate).add(5,'minutes');

  return app.db('games')
    .insert({ startDate: moment(startDate), endDate: moment(startDate).add(5,'minutes')}, ['id'])
    .then((game) => request(app).put(`${MAIN_ROUTE}/${game[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .send({ startDate: newStartDate, endDate: newEndDate }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(new Date(res.body.startDate)).toEqual(new Date(newStartDate));
      expect(new Date(res.body.endDate)).toEqual(new Date(newEndDate));
    });
});