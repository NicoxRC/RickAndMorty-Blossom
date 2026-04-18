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
  async getFavorites(): Promise<Favorite[]> {
    try {
      return await this.repository.findAll();
    } catch (err) {
      console.error('[FavoriteService] getFavorites error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async toggleFavorite(characterId: number): Promise<{ added: boolean }> {
    try {
      const existing = await this.repository.findByCharacterId(characterId);
      if (existing) {
        await this.repository.delete(characterId);
        return { added: false };
      }
      await this.repository.create(characterId);
      return { added: true };
    } catch (err) {
      console.error('[FavoriteService] toggleFavorite error:', err);
      throw err;
    }
  }
}

export const favoriteService = new FavoriteService();
