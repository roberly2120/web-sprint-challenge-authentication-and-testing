/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').truncate()
  await knex('users').insert([
    {username: 'user1', password: '1234'},
    {username: 'user2', password: '5678'},
    {username: 'user3', password: '6789'},
  ]);
};
