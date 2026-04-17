import { Favorite } from '@/models/favorite.model';
import { Character } from '@/models/character.model';
import { MeasureTime } from '@/decorators/measure-time.decorator';
import { IFavoriteRepository } from '@/interfaces/favorite.repository';

export class FavoriteRepository implements IFavoriteRepository {
  @MeasureTime()
  async findAll(): Promise<Favorite[]> {
    try {
      return await Favorite.findAll({
        include: [{ model: Character, as: 'character' }],
      });
    } catch (err) {
      console.error('[FavoriteRepository] findAll error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async findByCharacterId(characterId: number): Promise<Favorite | null> {
    try {
      return await Favorite.findOne({ where: { characterId } });
    } catch (err) {
      console.error('[FavoriteRepository] findByCharacterId error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async create(characterId: number): Promise<Favorite> {
    try {
      return await Favorite.create({ characterId });
    } catch (err) {
      console.error('[FavoriteRepository] create error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async delete(characterId: number): Promise<void> {
    try {
      await Favorite.destroy({ where: { characterId } });
    } catch (err) {
      console.error('[FavoriteRepository] delete error:', err);
      throw err;
    }
  }
}

export const favoriteRepository = new FavoriteRepository();
