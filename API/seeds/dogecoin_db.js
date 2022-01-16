import seeder from 'knex-csv-seeder';

exports.seed = seeder({
  table: 'dogecoin',
  file: 'C:\Users\pmdma\OneDrive\Ambiente de Trabalho\data_crypto\coin_Dogecoin.csv'
})

// function(knex, Promise) {
//   // Deletes ALL existing entries
//   return knex('table_name').del()
//     .then(function () {
//       // Inserts seed entries
//       return knex('table_name').insert([
//         {id: 1, colName: 'rowValue1'},
//         {id: 2, colName: 'rowValue2'},
//         {id: 3, colName: 'rowValue3'}
//       ]);
//     });
// };
