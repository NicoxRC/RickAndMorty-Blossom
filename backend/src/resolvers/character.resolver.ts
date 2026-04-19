import { GraphQLError } from 'graphql';

import { characterService } from '@/services/character.service';
import { favoriteService } from '@/services/favorite.service';
import { commentService } from '@/services/comment.service';

import type { Character, Comment } from '@/models';
import { User } from '@/models';
import type {
  CharacterFilters,
  CharacterFiltersInput,
} from '@/types/character.types';
import { Role } from '@/types/user.types';

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
        const character = await characterService.getCharacterById(id);
        if (!character) {
          throw new GraphQLError('Character not found');
        }
        return character;
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
      { id, userId }: { id: number; userId: number },
    ): Promise<boolean> => {
      try {
        const user = await User.findByPk(userId);
        if (!user) {
          throw new GraphQLError('User not found');
        }
        if (user.role !== Role.ADMIN) {
          throw new GraphQLError(
            'Forbidden: only users with role ADMIN can delete characters',
          );
        }
        const character = await characterService.getCharacterById(id);
        if (!character) {
          throw new GraphQLError('Character not found');
        }
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

    isFavorite: async (
      parent: Character,
      { userId }: { userId: number },
    ): Promise<boolean> => {
      try {
        const favorite = await favoriteService.getFavoriteByUserAndCharacterId(
          userId,
          parent.id,
        );
        return !!favorite;
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
