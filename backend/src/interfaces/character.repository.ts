import type { Character } from '@/models';
import type { CharacterFilters } from '@/types/character.types';

export interface ICharacterRepository {
  findAll(filters: CharacterFilters): Promise<Character[]>;
  findById(id: number): Promise<Character | null>;
  findByExternalId(externalId: number): Promise<Character | null>;
  softDelete(id: number): Promise<void>;
  restore(id: number): Promise<void>;
}
