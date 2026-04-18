import { GraphQLError } from 'graphql';

import { commentService } from '@/services/comment.service';

import type { Comment } from '@/models';

export const commentResolvers = {
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
  },
};
