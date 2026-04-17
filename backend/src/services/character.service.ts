import { Character } from '@/models/character.model';
import { MeasureTime } from '@/decorators/measure-time.decorator';
import { CacheService } from '@/cache/cache.service';
import {
  CharacterRepository,
  characterRepository,
} from '@/repositories/character.repository';

import type { CharacterFilters } from '@/types/character.types';

export class CharacterService {
  private readonly repository: CharacterRepository;
  private readonly cache: CacheService;

  constructor(repository: CharacterRepository = characterRepository) {
    this.repository = repository;
    this.cache = new CacheService();
  }

  @MeasureTime()
  async getCharacters(filters: CharacterFilters): Promise<Character[]> {
    try {
      const cacheKey = `characters:${JSON.stringify(filters)}`;
      const cached = await this.cache.get<Character[]>(cacheKey);
      if (cached) return cached;

      const characters = await this.repository.findAll(filters);
      await this.cache.set(cacheKey, characters, 60);
      return characters;
    } catch (err) {
      console.error('[CharacterService] getCharacters error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async getCharacterById(id: number): Promise<Character | null> {
    try {
      const cacheKey = `character:${id}`;
      const cached = await this.cache.get<Character>(cacheKey);
      if (cached) return cached;

      const character = await this.repository.findById(id);
      if (character) {
        await this.cache.set(cacheKey, character, 60);
      }
      return character;
    } catch (err) {
      console.error('[CharacterService] getCharacterById error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async softDeleteCharacter(id: number): Promise<void> {
    try {
      await this.repository.softDelete(id);
      await this.cache.del(`character:${id}`);
      await this.cache.invalidatePattern('characters:*');
    } catch (err) {
      console.error('[CharacterService] softDeleteCharacter error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async restoreCharacter(id: number): Promise<void> {
    try {
      await this.repository.restore(id);
      await this.cache.del(`character:${id}`);
      await this.cache.invalidatePattern('characters:*');
    } catch (err) {
      console.error('[CharacterService] restoreCharacter error:', err);
      throw err;
    }
  }
}

export const characterService = new CharacterService();
