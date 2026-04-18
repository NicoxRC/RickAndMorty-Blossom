import { GraphQLError } from 'graphql';

import { favoriteService } from '@/services/favorite.service';

export const favoriteResolvers = {
  Mutation: {
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
  },
};
