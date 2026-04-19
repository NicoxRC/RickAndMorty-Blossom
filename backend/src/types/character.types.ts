import { Optional } from 'sequelize';

export interface CharacterFiltersInput {
  name?: string;
  status?: CharacterFilters['status'];
  species?: string;
  gender?: CharacterFilters['gender'];
  origin?: string;
}

export interface CharacterFilters {
  name?: string;
  status?: CharacterStatus;
  species?: string;
  gender?: CharacterGender;
  origin?: string;
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

export interface CharacterRow {
  external_id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  origin: string;
  location: string;
  deleted_at: null;
  created_at: Date;
  updated_at: Date;
}

export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';
export type CharacterGender = 'Female' | 'Male' | 'Genderless' | 'unknown';

export type CharacterCreationAttributes = Optional<
  CharacterAttributes,
  'id' | 'deletedAt' | 'createdAt' | 'updatedAt'
>;
