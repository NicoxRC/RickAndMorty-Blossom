import { QueryInterface, DataTypes } from 'sequelize';

async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('comments', 'user_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'SET NULL',
  });
}

async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('comments', 'user_id');
}

module.exports = { up, down };
