import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

export interface CharacterAttributes {
  id: number;
  externalId: number;
  name: string;
  status: CharacterStatus;
  species: string;
  gender: CharacterGender;
  image: string;
  origin: string;
  location: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CharacterCreationAttributes = Optional<
  CharacterAttributes,
  'id' | 'deletedAt' | 'createdAt' | 'updatedAt'
>;

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
