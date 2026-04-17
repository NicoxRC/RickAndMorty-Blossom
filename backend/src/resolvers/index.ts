import { GraphQLError } from 'graphql';

import { characterService } from '@/services/character.service';
import { commentService } from '@/services/comment.service';
import { favoriteService } from '@/services/favorite.service';

import type { Character } from '@/models/character.model';
import type { Comment } from '@/models/comment.model';
import type {
  CharacterFilters,
  CharacterFiltersInput,
} from '@/types/character.types';

export const resolvers = {
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
    addComment: async (
      _: unknown,
      { characterId, content }: { characterId: number; content: string },
    ): Promise<Comment> => {
      try {
        return await commentService.addComment(characterId, content);
      } catch (err) {
        throw new GraphQLError(
          err instanceof Error ? err.message : 'Failed to add comment',
        );
      }
    },

    toggleFavorite: async (
      _: unknown,
      { characterId }: { characterId: number },
    ): Promise<{ added: boolean }> => {
      try {
        return await favoriteService.toggleFavorite(characterId);
      } catch (err) {
        throw new GraphQLError(
          err instanceof Error ? err.message : 'Failed to toggle favorite',
        );
      }
    },

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
