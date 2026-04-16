import { QueryInterface, DataTypes } from 'sequelize';

async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('comments', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    character_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'characters', key: 'id' },
      onDelete: 'CASCADE',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
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
  await queryInterface.dropTable('comments');
}

module.exports = { up, down };
