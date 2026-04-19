import { GraphQLError } from 'graphql';

import { userService } from '@/services/user.service';

import type { User } from '@/models';
import type { Role } from '@/types/user.types';

export const userResolvers = {
  Query: {
    userById: async (
      _: unknown,
      { id }: { id: number },
    ): Promise<User | null> => {
      try {
        const user = await userService.getUserById(id);
        if (!user) {
          throw new GraphQLError('User not found');
        }
        return user;
      } catch (err) {
        throw new GraphQLError(
          err instanceof Error ? err.message : 'Failed to fetch user by ID',
        );
      }
    },

    userByName: async (
      _: unknown,
      { name }: { name: string },
    ): Promise<User | null> => {
      try {
        const user = await userService.getUserByName(name);
        if (!user) {
          throw new GraphQLError('User not found');
        }
        return user;
      } catch (err) {
        throw new GraphQLError(
          err instanceof Error ? err.message : 'Failed to fetch user by name',
        );
      }
    },
  },
  Mutation: {
    createUser: async (
      _: unknown,
      { name, role }: { name: string; role: Role },
    ): Promise<User> => {
      try {
        const existingUser = await userService.getUserByName(name);
        if (existingUser) {
          throw new GraphQLError('User already exists');
        }
        return await userService.createUser(name, role);
      } catch (err) {
        throw new GraphQLError(
          err instanceof Error ? err.message : 'Failed to create user',
        );
      }
    },
  },
};
