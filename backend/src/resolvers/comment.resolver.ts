import { GraphQLError } from 'graphql';

import { commentService } from '@/services/comment.service';

import { Character, User, type Comment } from '@/models';

export const commentResolvers = {
  Comment: {
    userName: async (parent: Comment): Promise<string | null> => {
      if (!parent.userId) return null;
      try {
        const user = await User.findByPk(parent.userId);
        return user?.name ?? null;
      } catch {
        return null;
      }
    },
  },
  Mutation: {
    addComment: async (
      _: unknown,
      {
        characterId,
        content,
        userId,
      }: { characterId: number; content: string; userId?: number },
    ): Promise<Comment> => {
      try {
        const character = await Character.findByPk(characterId);
        if (!character) {
          throw new GraphQLError('Character not found');
        }
        if (userId) {
          const user = await User.findByPk(userId);
          if (!user) {
            throw new GraphQLError('User not found');
          }
        }
        return await commentService.addComment(characterId, content, userId);
      } catch (err) {
        throw new GraphQLError(
          err instanceof Error ? err.message : 'Failed to add comment',
        );
      }
    },
  },
};
