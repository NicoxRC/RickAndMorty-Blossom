import type { Comment } from './comment.types';

export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

export interface CharacterFiltersInput {
  name?: string;
  status?: CharacterStatus;
  species?: string;
  gender?: CharacterGender;
  origin?: string;
}

export interface Character {
  id: number;
  externalId: number;
  name: string;
  status: CharacterStatus;
  species: string;
  gender: CharacterGender;
  image: string;
  origin: string;
  location: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  isFavorite: boolean;
}
