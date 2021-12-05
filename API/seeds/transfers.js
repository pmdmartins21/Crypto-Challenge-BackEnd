exports.seed = (knex) => {
  return knex('transactions').del()
    .then(() => knex('game_wallet').del())
    .then(() => knex('game_users').del())
    .then(() => knex('users').del())
    .then(() => knex('users').insert([
      { id: 10000, name: 'User IPCA #1', email: 'user1@ipca.pt', password: '$2a$10$1kcSOLd9CXv1EX/VInoWge5xNtwxZC80BehqxKPPSJ3Qo4auzVVwe' },
      { id: 10001, name: 'User IPCA #2', email: 'user2@ipca.pt', password: '$2a$10$1kcSOLd9CXv1EX/$2a$10$qXCujzU5OCSy8BrN0XdDeuBEvNt0MO5XkHMLDuKdsiomwjpwsXzuW' },
    ]))
    .then(() => knex('accounts').insert([
      { id: 10000, name: 'AccOri #1.1', user_id: 10000 },
      { id: 10001, name: 'AccDest #1.2', user_id: 10000 },
      { id: 10002, name: 'AccOri #2.1', user_id: 10001 },
      { id: 10003, name: 'AccDest #2.2', user_id: 10001 },
    ]))
    .then(() => knex('transfers').insert([
      { id: 10000, desc: 'Transfer #1', user_id: 10000, acc_ori_id: 10000, acc_dest_id: 10001, amount: 100, date: new Date() },
      { id: 10001, desc: 'Transfer #2', user_id: 10001, acc_ori_id: 10002, acc_dest_id: 10003, amount: 200, date: new Date() },
    ]))
    .then(() => knex('transactions').insert([
      { desc: 'Transfer from AccOri #1.1', date: new Date(), amount: 100, type: 'I', acc_id: 10001, transfer_id: 10000 },
      { desc: 'Transfer to AccDest #1.2', date: new Date(), amount: -100, type: 'O', acc_id: 10000, transfer_id: 10000 },
      { desc: 'Transfer from AccOri #2.1', date: new Date(), amount: 200, type: 'I', acc_id: 10003, transfer_id: 10001 },
      { desc: 'Transfer to AccDest #2.2', date: new Date(), amount: -200, type: 'O', acc_id: 10002, transfer_id: 10001 },
    ]));
};
