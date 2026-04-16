import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CommentAttributes {
  id: number;
  characterId: number;
  content: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CommentCreationAttributes = Optional<
  CommentAttributes,
  'id' | 'deletedAt' | 'createdAt' | 'updatedAt'
>;

export class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  declare id: number;
  declare characterId: number;
  declare content: string;
  declare deletedAt: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    characterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'characters',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    content: {
      type: DataTypes.TEXT,
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
    tableName: 'comments',
    paranoid: true,
    underscored: true,
    timestamps: true,
  },
);
