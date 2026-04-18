import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@/config/database';

import type {
  FavoriteAttributes,
  FavoriteCreationAttributes,
} from '@/types/favorite.types';

export class Favorite
  extends Model<FavoriteAttributes, FavoriteCreationAttributes>
  implements FavoriteAttributes
{
  declare id: number;
  declare characterId: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Favorite.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    characterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'characters',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'favorites',
    paranoid: false,
    underscored: true,
    timestamps: true,
  },
);
