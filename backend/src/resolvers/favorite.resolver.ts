import { GraphQLError } from 'graphql';

import { favoriteService } from '@/services/favorite.service';
import { Character, User } from '@/models';

export const favoriteResolvers = {
  Mutation: {
    toggleFavorite: async (
      _: unknown,
      { characterId, userId }: { characterId: number; userId: number },
    ): Promise<{ added: boolean }> => {
      try {
        const character = await Character.findByPk(characterId);
        if (!character) {
          throw new GraphQLError('Character not found');
        }
        const user = await User.findByPk(userId);
        if (!user) {
          throw new GraphQLError('User not found');
        }
        return await favoriteService.toggleFavorite(characterId, userId);
      } catch (err) {
        throw new GraphQLError(
          err instanceof Error ? err.message : 'Failed to toggle favorite',
        );
      }
    },
  },
};
