import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkInsert('users', [
      {
        name: 'admin',
        role: 'ADMIN',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'user',
        role: 'USER',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete('users', { name: ['admin', 'user'] });
  },
};
