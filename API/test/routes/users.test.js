const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const username = `${Date.now()}`;
const secret = 'CdTp!DWM@202122';
const MAIN_ROUTE = '/v1/users';
const email = `${Date.now()}@gmail.com`

let user;
let userAdmin = {
  firstName: 'Pedro',
  lastName: 'Martins',
  username: 'admin',
  password: 'admin',
  email: 'admin@cryptochallenge.com'
};

beforeAll(async () => {
  const res = await app.services.user.save({ firstName: 'Pedro', lastName: 'Martins', username: username, password: '12345', email: email });
  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
});

test('Test #1 - Listar os utilizadores', () => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).not.toHaveLength(0);
      expect(res.body[0]).toHaveProperty('firstName');
    });
});


test('Test #2 - Inserir utilizadores', () => {
  return request(app).post(MAIN_ROUTE)
  .set('authorization', `bearer ${user.token}`)
    .send({ firstName: 'João', lastName: 'Manuel', username: `${Date.now()}`, 
            email: `${Date.now()}@gmail.com`, password: '12345' })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.firstName).toBe('João');
      expect(res.body).not.toHaveProperty('password');
    });
});


test('Test #2.1 - Guardar a palavra passe encriptada', async () => {
  const res = await request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({ firstName: 'João', lastName: 'Manuel', username: `${Date.now()}`, 
            email: `${Date.now()}@gmail.com`, password: '12345' })
  expect(res.status).toBe(201);

  const { id } = res.body;
  const userDB = await app.services.user.findOne({ id });
  expect(userDB.password).not.toBeUndefined();
  expect(userDB.password).not.toBe('12345');
});

describe(' Test 2.2 - Validação de criar um user', () => {
  const testTemplate = (newData, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .send({
        firstName: 'João', lastName: 'Manuel', username: `${Date.now()}`, 
            email: `${Date.now()}@gmail.com`, password: '12345', ...newData,
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Test 2.2.1 - Sem First Name', () => testTemplate({ firstName: null }, 'O First Name é um atributo obrigatório'));
  test('Test 2.2.2 - Sem Last Name', () => testTemplate({ lastName: null }, 'O Last Name é um atributo obrigatório'));
  test('Test 2.2.3 - Sem Email', () => testTemplate({ email: null }, 'O EMAIL é um atributo obrigatório'));
  test('Test 2.2.4 - Sem Username', () => testTemplate({ username: null }, 'O USERNAME é um atributo obrigatório'));
  test('Test 2.2.5 - Sem Password', () => testTemplate({ password: null }, 'A Password é um atributo obrigatório'));
});


test('Test #2.3 - Inserir username Duplicado', () => {
  const usernameParaDuplicar = `${Date.now()}`;

  return app.db('users')
    .insert({ firstName: 'Zé', lastName: 'Manuel', username: usernameParaDuplicar, 
    email: `${Date.now()}@gmail.com`, password: '12345'})
    .then(() => request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .send({firstName: 'Zé', lastName: 'Manuel', username: usernameParaDuplicar, 
      email: `${Date.now()}@gmail.com`, password: '12345'}))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Já existe uma conta com o username indicado');
    });
});

// test('Test #2.4 - Inserir email Duplicado', () => {
//   return app.db('users')
//     .insert({ firstName: 'Zé', lastName: 'Manuel', username: `${Date.now()}@gmail.com`, 
//     email: email, password: '12345'})
//     .then(() => request(app).post(MAIN_ROUTE)
//       .set('authorization', `bearer ${user.token}`)
//       .send({ firstName: 'Zé', lastName: 'Manuel', username: `${Date.now()}@gmail.com`, 
//       email: email, password: '12345'}))
//     .then((res) => {
//       expect(res.status).toBe(400);
//       expect(res.body.error).toBe('Já existe uma conta com o email indicado');
//     });
// });


// test('Teste #3 - Listar um user por id', () => {
//   return app.db('users')
//     .insert({ firstName: 'João', lastName: 'Manuel', username: `${Date.now()}`, 
//     email: `${Date.now()}@gmail.com`, password: '12345' }, ['id'])
//     .then((user) => request(app).get(`${MAIN_ROUTE}/${user[0].id}`)
//       .set('authorization', `bearer ${user.token}`))
//     .then((res) => {
//       expect(res.status).toBe(200);
//       expect(res.body[0].firstName).toBe('João');
//       expect(res.body[0]).not.toHaveProperty('password');
//     });
// });
// test('Test #4 - Eliminar User', () => {
//   return app.db('user')
//     .insert({ firstName: 'Zé', lastName: 'Manuel', username: `${Date.now()}@gmail.com`, 
//     email: `${Date.now()}@gmail.com`, password: '12345'}, ['id'])
//     .then((user) => request(app).delete(`${MAIN_ROUTE}/${user[0].id}`)
//       .set('authorization', `bearer ${user.token}`))
//     .then((res) => {
//       expect(res.status).toBe(204);
//     });
// });

// //por os testes abaixo dentro deste describe


// test('Test #5 - Alterar info de utilizador por Id', async () => {
//   return app.db(MAIN_ROUTE)
//     .insert({ firstName: 'OldName', lastName: 'Manuel', username: `${Date.now()}`, 
//     email: `${Date.now()}@gmail.com`, password: '12345'}, ['id'])
//     .then((acc) => request(app).put(`${MAIN_ROUTE}/${acc[0].id}`)
//       .set('authorization', `bearer ${user.token}`)
//       .send({ firstName: 'NewName' }))
//     .then((res) => {
//       expect(res.status).toBe(200);
//       expect(res.body.firstName).toBe('NewName');
//     });
// });



