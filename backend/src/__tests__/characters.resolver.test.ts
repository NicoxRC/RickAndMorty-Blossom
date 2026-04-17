/// <reference types="jest" />
import 'reflect-metadata';

jest.mock('../services/character.service');
jest.mock('../cache/cache.service');
jest.mock('../repositories/character.repository');

import { resolvers } from '../resolvers/index';
import { characterService } from '../services/character.service';
import { CharacterRepository } from '../repositories/character.repository';
import { CacheService } from '../cache/cache.service';

import type { Character } from '../models/character.model';
import type { CharacterFilters } from '../types/character.types';

const { CharacterService } = jest.requireActual<
  typeof import('../services/character.service')
>('../services/character.service');

function mockCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 1,
    externalId: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    origin: 'Earth',
    location: 'Earth',
    deletedAt: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides,
  } as Character;
}

const mockedGetCharacters =
  characterService.getCharacters as jest.MockedFunction<
    typeof characterService.getCharacters
  >;

const callCharactersResolver = resolvers.Query.characters as (
  root: unknown,
  args: unknown,
  ctx: unknown,
  info: unknown,
) => Promise<Character[]>;

describe('characters resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Test 1: no filters ────────────────────────────────────────────────────

  it('returns all characters when no filters are provided', async () => {
    const expected = [mockCharacter()];
    mockedGetCharacters.mockResolvedValue(expected);

    const result = await callCharactersResolver({}, {}, {}, {});

    const expectedFilters: CharacterFilters = {
      status: undefined,
      species: undefined,
      gender: undefined,
    };

    expect(mockedGetCharacters).toHaveBeenCalledTimes(1);
    expect(mockedGetCharacters).toHaveBeenCalledWith(expectedFilters);
    expect(result).toEqual(expected);
  });

  // ── Test 2: name filter is NOT forwarded (current resolver behaviour) ─────

  it('filters characters by status but does not forward the name filter', async () => {
    const expected = [mockCharacter({ name: 'Rick Sanchez' })];
    mockedGetCharacters.mockResolvedValue(expected);

    const result = await callCharactersResolver(
      {},
      { filters: { name: 'Rick Sanchez', status: 'Alive' } },
      {},
      {},
    );

    const expectedFilters: CharacterFilters = {
      status: 'Alive',
      species: undefined,
      gender: undefined,
    };

    expect(mockedGetCharacters).toHaveBeenCalledTimes(1);
    expect(mockedGetCharacters).toHaveBeenCalledWith(expectedFilters);
    expect(result).toEqual(expected);
  });
});

describe('CharacterService cache behavior', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let service: any; // typed as `any` because we use jest.requireActual
  let mockRepo: jest.Mocked<Pick<CharacterRepository, 'findAll'>>;
  let mockCache: jest.Mocked<Pick<CacheService, 'get' | 'set'>>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepo = { findAll: jest.fn() };

    mockCache = {
      get: jest.fn(),
      set: jest.fn(),
    };

    (CacheService as jest.MockedClass<typeof CacheService>).mockImplementation(
      () => mockCache as unknown as CacheService,
    );

    service = new CharacterService(mockRepo as unknown as CharacterRepository);
  });

  // ── Test 3: cache miss → DB hit → result cached; second call is a cache hit

  it('calls repository on cache miss and skips it on cache hit', async () => {
    const filters: CharacterFilters = { status: 'Alive' };
    const characters = [mockCharacter()];
    const cacheKey = `characters:${JSON.stringify(filters)}`;

    mockCache.get.mockResolvedValueOnce(null);
    mockRepo.findAll.mockResolvedValueOnce(characters);
    mockCache.set.mockResolvedValue(undefined);

    const firstResult = await service.getCharacters(filters);

    expect(mockCache.get).toHaveBeenCalledWith(cacheKey);
    expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    expect(mockRepo.findAll).toHaveBeenCalledWith(filters);
    expect(mockCache.set).toHaveBeenCalledWith(cacheKey, characters, 60);
    expect(firstResult).toEqual(characters);

    mockCache.get.mockResolvedValueOnce(characters);

    const secondResult = await service.getCharacters(filters);

    expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    expect(secondResult).toEqual(characters);
  });
});
