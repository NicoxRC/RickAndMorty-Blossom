import { Favorite } from '@/models';
import { MeasureTime } from '@/decorators/measure-time.decorator';
import {
  FavoriteRepository,
  favoriteRepository,
} from '@/repositories/favorite.repository';

export class FavoriteService {
  private readonly repository: FavoriteRepository;

  constructor(repository: FavoriteRepository = favoriteRepository) {
    this.repository = repository;
  }

  @MeasureTime()
  async getFavoriteByUserAndCharacterId(
    userId: number,
    characterId: number,
  ): Promise<Favorite | null> {
    try {
      return await this.repository.findByCharacterAndUserId(
        userId,
        characterId,
      );
    } catch (err) {
      console.error(
        '[FavoriteService] getFavoriteByUserAndCharacterId error:',
        err,
      );
      throw err;
    }
  }

  @MeasureTime()
  async toggleFavorite(
    userId: number,
    characterId: number,
  ): Promise<{ added: boolean }> {
    try {
      const existing = await this.repository.findByCharacterAndUserId(
        userId,
        characterId,
      );
      if (existing) {
        await this.repository.delete(userId, characterId);
        return { added: false };
      }
      await this.repository.create(userId, characterId);
      return { added: true };
    } catch (err) {
      console.error('[FavoriteService] toggleFavorite error:', err);
      throw err;
    }
  }
}

export const favoriteService = new FavoriteService();
