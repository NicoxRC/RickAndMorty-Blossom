import { Op, WhereOptions } from 'sequelize';
import {
  Character,
  CharacterAttributes,
  CharacterGender,
  CharacterStatus,
} from '../models/character.model';
import { MeasureTime } from '../decorators/measure-time.decorator';

export interface CharacterFilters {
  status?: CharacterStatus;
  species?: string;
  gender?: CharacterGender;
}

export interface ICharacterRepository {
  findAll(filters: CharacterFilters): Promise<Character[]>;
  findById(id: number): Promise<Character | null>;
  findByExternalId(externalId: number): Promise<Character | null>;
  softDelete(id: number): Promise<void>;
  restore(id: number): Promise<void>;
}

export class CharacterRepository implements ICharacterRepository {
  @MeasureTime()
  async findAll(filters: CharacterFilters): Promise<Character[]> {
    try {
      const where: WhereOptions<CharacterAttributes> = {};

      if (filters.status !== undefined) {
        where.status = filters.status;
      }
      if (filters.species !== undefined) {
        where.species = { [Op.iLike]: `%${filters.species}%` };
      }
      if (filters.gender !== undefined) {
        where.gender = filters.gender;
      }

      return await Character.findAll({ where });
    } catch (err) {
      console.error('[CharacterRepository] findAll error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async findById(id: number): Promise<Character | null> {
    try {
      return await Character.findByPk(id);
    } catch (err) {
      console.error('[CharacterRepository] findById error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async findByExternalId(externalId: number): Promise<Character | null> {
    try {
      return await Character.findOne({ where: { externalId } });
    } catch (err) {
      console.error('[CharacterRepository] findByExternalId error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async softDelete(id: number): Promise<void> {
    try {
      const character = await Character.findByPk(id);
      if (!character) {
        throw new Error(`Character with id ${id} not found`);
      }
      await character.destroy();
    } catch (err) {
      console.error('[CharacterRepository] softDelete error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async restore(id: number): Promise<void> {
    try {
      await Character.restore({ where: { id } });
    } catch (err) {
      console.error('[CharacterRepository] restore error:', err);
      throw err;
    }
  }
}

export const characterRepository = new CharacterRepository();
