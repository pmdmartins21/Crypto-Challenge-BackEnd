const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const username = `${Date.now()}`;
const secret = 'CdTp!DWM@202122';
const MAIN_ROUTE = '/v1/users';

let user;


beforeAll(async () => {
  const res = await app.services.user.save({ firstName: 'Pedro', lastName: 'Martins', username: username, password: '12345' });
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
});


test('Teste #13 - Inserir Transação de um utilizador', () => {});

test('Teste #14 - Listar transaçoes de utilizador', () => {});

test('Teste #15 - Listar todas as transaçoes', () => {});

test('Teste #16 - Aceder a transaçoes de outro utilizador', () => {});

test('Teste #17 - Transaçoes de compra devem ser positivas', () => {});
test('Teste #17 -Transaçoes de venda devem ser negativas', () => {});
test('Teste #17 - Tentar uma transaçao de compra sem saldo suficiente', () => {});
test('Teste #17 - Tentar um transaçao de venda sem possuir a cripto em carteira, ou em quantidade suficiente', () => {});
//validar todos os campos
describe('Validação de criar uma transação', () => {
  const testTemplate = (newData, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${userA.token}`)
      .send({
        desc: 'New Trans', date: new Date(), amount: 150, type: 'I', acc_id: accUserA.id, ...newData,
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Test 9.1 - Sem descrição', () => testTemplate({ desc: null }, 'A DESCRIÇÃO é um atributo obrigatório'));
  test('Test 9.2 - Sem valor', () => testTemplate({ amount: null }, 'O VALOR é um atributo obrigatório'));
  test('Test 9.3 - Sem data', () => testTemplate({ date: null }, 'A DATA é um atributo obrigatório'));
  test('Test 9.4 - Sem conta', () => testTemplate({ acc_id: null }, 'A CONTA é um atributo obrigatório'));
  test('Test 9.5 - Sem tipo', () => testTemplate({ type: null }, 'O TIPO é um atributo obrigatório'));
  test('Test 9.6 - Com tipo errado', () => testTemplate({ type: 'P' }, 'O TIPO tem um valor inválido'));
});
test('Teste #17 - Validar se os campos estão todos bem preenchidos', () => {});
