import { mergeResolvers } from '@graphql-tools/merge';

import { characterResolvers } from './character.resolver';
import { commentResolvers } from './comment.resolver';
import { favoriteResolvers } from './favorite.resolver';

export const resolvers = mergeResolvers([
  characterResolvers,
  commentResolvers,
  favoriteResolvers,
]);
