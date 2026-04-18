import { QueryInterface, DataTypes } from 'sequelize';

async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('favorites', 'user_id', {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'CASCADE',
  });

  await queryInterface.addIndex('favorites', ['character_id', 'user_id'], {
    unique: true,
  });
}

async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeIndex('favorites', ['character_id', 'user_id']);
  await queryInterface.removeColumn('favorites', 'user_id');
}

module.exports = { up, down };
