import { QueryInterface } from 'sequelize';

async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeConstraint(
    'favorites',
    'favorites_character_id_key',
  );
}

async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addConstraint('favorites', {
    fields: ['character_id'],
    type: 'unique',
    name: 'favorites_character_id_key',
  });
}

module.exports = { up, down };
