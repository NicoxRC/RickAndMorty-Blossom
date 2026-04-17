import type { Favorite } from '@/models';

export interface IFavoriteRepository {
  findAll(): Promise<Favorite[]>;
  findByCharacterId(characterId: number): Promise<Favorite | null>;
  create(characterId: number): Promise<Favorite>;
  delete(characterId: number): Promise<void>;
}
