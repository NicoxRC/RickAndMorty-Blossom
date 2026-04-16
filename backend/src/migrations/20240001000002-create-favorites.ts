import { QueryInterface, DataTypes } from 'sequelize';

async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('favorites', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    character_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: 'characters', key: 'id' },
      onDelete: 'CASCADE',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
}

async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('favorites');
}

module.exports = { up, down };
