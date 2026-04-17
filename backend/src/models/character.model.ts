import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@/config/database';

import type {
  CharacterAttributes,
  CharacterCreationAttributes,
  CharacterGender,
  CharacterStatus,
} from '@/types/character.types';

export class Character
  extends Model<CharacterAttributes, CharacterCreationAttributes>
  implements CharacterAttributes
{
  declare id: number;
  declare externalId: number;
  declare name: string;
  declare status: CharacterStatus;
  declare species: string;
  declare gender: CharacterGender;
  declare image: string;
  declare origin: string;
  declare location: string;
  declare deletedAt: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Character.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    externalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Alive', 'Dead', 'unknown'),
      allowNull: false,
    },
    species: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('Female', 'Male', 'Genderless', 'unknown'),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: 'characters',
    paranoid: true,
    underscored: true,
    timestamps: true,
  },
);
