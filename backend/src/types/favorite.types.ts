import { Optional } from 'sequelize';

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
