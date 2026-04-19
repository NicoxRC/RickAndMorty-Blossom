import { Favorite } from '@/models';
import { MeasureTime } from '@/decorators/measure-time.decorator';
import { IFavoriteRepository } from '@/interfaces/favorite.repository';

export class FavoriteRepository implements IFavoriteRepository {
  @MeasureTime()
  async findByCharacterAndUserId(
    userId: number,
    characterId: number,
  ): Promise<Favorite | null> {
    try {
      return await Favorite.findOne({ where: { userId, characterId } });
    } catch (err) {
      console.error('[FavoriteRepository] findByCharacterId error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async create(userId: number, characterId: number): Promise<Favorite> {
    try {
      return await Favorite.create({ userId, characterId });
    } catch (err) {
      console.error('[FavoriteRepository] create error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async delete(userId: number, characterId: number): Promise<void> {
    try {
      await Favorite.destroy({ where: { userId, characterId } });
    } catch (err) {
      console.error('[FavoriteRepository] delete error:', err);
      throw err;
    }
  }
}

export const favoriteRepository = new FavoriteRepository();
