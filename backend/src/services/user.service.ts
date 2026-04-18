import { User } from '@/models';
import { MeasureTime } from '@/decorators/measure-time.decorator';
import { userRepository, UserRepository } from '@/repositories/user.repository';

import type { Role } from '@/types/user.types';

export class UserService {
  private readonly repository: UserRepository;

  constructor(repository: UserRepository = userRepository) {
    this.repository = repository;
  }

  @MeasureTime()
  async getUserById(id: number): Promise<User | null> {
    try {
      return await this.repository.findById(id);
    } catch (err) {
      console.error('[UserService] getUserById error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async getUserByName(name: string): Promise<User | null> {
    try {
      return await this.repository.findByName(name);
    } catch (err) {
      console.error('[UserService] getUserByName error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async createUser(name: string, role: Role): Promise<User> {
    try {
      return await this.repository.create(name, role);
    } catch (err) {
      console.error('[UserService] createUser error:', err);
      throw err;
    }
  }
}

export const userService = new UserService();
