import { Optional } from 'sequelize';

export interface CharacterFiltersInput {
  name?: string;
  status?: CharacterFilters['status'];
  species?: string;
  gender?: CharacterFilters['gender'];
  origin?: string;
}

export interface CharacterFilters {
  status?: CharacterStatus;
  species?: string;
  gender?: CharacterGender;
}

export interface CharacterAttributes {
  id: number;
  externalId: number;
  name: string;
  status: CharacterStatus;
  species: string;
  gender: CharacterGender;
  image: string;
  origin: string;
  location: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

export type CharacterCreationAttributes = Optional<
  CharacterAttributes,
  'id' | 'deletedAt' | 'createdAt' | 'updatedAt'
>;
