export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

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

export interface Comment {
  id: number;
  characterId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: number;
  characterId: number;
  createdAt: string;
}

export interface ToggleFavoriteResult {
  added: boolean;
}

export interface CharacterFiltersInput {
  name?: string;
  status?: CharacterStatus;
  species?: string;
  gender?: CharacterGender;
  origin?: string;
}
