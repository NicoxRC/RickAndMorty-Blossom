import type { Favorite } from '@/models';

export interface IFavoriteRepository {
  findByCharacterAndUserId(
    userId: number,
    characterId: number,
  ): Promise<Favorite | null>;
  create(userId: number, characterId: number): Promise<Favorite>;
  delete(userId: number, characterId: number): Promise<void>;
}
