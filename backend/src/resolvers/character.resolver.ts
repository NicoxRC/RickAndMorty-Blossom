import { GraphQLError } from 'graphql';

import { characterService } from '@/services/character.service';
import { favoriteService } from '@/services/favorite.service';
import { commentService } from '@/services/comment.service';

import type { Character, Comment } from '@/models';
import type {
  CharacterFilters,
  CharacterFiltersInput,
} from '@/types/character.types';

export const characterResolvers = {
  Query: {
    characters: async (
      _: unknown,
      { filters }: { filters?: CharacterFiltersInput },
    ): Promise<Character[]> => {
      try {
        const serviceFilters: CharacterFilters = {
          status: filters?.status,
          species: filters?.species,
          gender: filters?.gender,
        };
        return await characterService.getCharacters(serviceFilters);
      } catch (err) {
        throw new GraphQLError(
          err instanceof Error ? err.message : 'Failed to fetch characters',
        );
      }
    },

    character: async (
      _: unknown,
      { id }: { id: number },
    ): Promise<Character | null> => {
      try {
        return await characterService.getCharacterById(id);
      } catch (err) {
        throw new GraphQLError(
          err instanceof Error ? err.message : 'Failed to fetch character',
        );
      }
    },
  },

  Mutation: {
    softDeleteCharacter: async (
      _: unknown,
      { id }: { id: number },
    ): Promise<boolean> => {
      try {
        await characterService.softDeleteCharacter(id);
        return true;
      } catch (err) {
        throw new GraphQLError(
          err instanceof Error
            ? err.message
            : 'Failed to soft-delete character',
        );
      }
    },
  },

  Character: {
    comments: async (parent: Character): Promise<Comment[]> => {
      try {
        return await commentService.getCommentsByCharacter(parent.id);
      } catch (err) {
        throw new GraphQLError(
          err instanceof Error ? err.message : 'Failed to fetch comments',
        );
      }
    },

    isFavorite: async (parent: Character): Promise<boolean> => {
      try {
        const favorites = await favoriteService.getFavorites();
        return favorites.some((f) => f.characterId === parent.id);
      } catch (err) {
        throw new GraphQLError(
          err instanceof Error
            ? err.message
            : 'Failed to check favorite status',
        );
      }
    },
  },
};
