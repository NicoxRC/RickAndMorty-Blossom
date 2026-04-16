import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface FavoriteAttributes {
  id: number;
  characterId: number;
  createdAt: Date;
  updatedAt: Date;
}

export type FavoriteCreationAttributes = Optional<
  FavoriteAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

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
