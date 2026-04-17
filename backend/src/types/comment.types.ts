import { Optional } from 'sequelize';

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
