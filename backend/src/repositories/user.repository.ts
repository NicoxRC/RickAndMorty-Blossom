import { User } from '@/models';
import { MeasureTime } from '@/decorators/measure-time.decorator';
import { IUserRepository } from '@/interfaces/user.repository';

import type { Role } from '@/types/user.types';

export class UserRepository implements IUserRepository {
  @MeasureTime()
  async findById(id: number): Promise<User | null> {
    try {
      return await User.findByPk(id);
    } catch (err) {
      console.error('[UserRepository] findById error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async findByName(name: string): Promise<User | null> {
    try {
      return await User.findOne({ where: { name } });
    } catch (err) {
      console.error('[UserRepository] findByName error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async create(name: string, role: Role): Promise<User> {
    try {
      return await User.create({ name, role });
    } catch (err) {
      console.error('[UserRepository] create error:', err);
      throw err;
    }
  }
}

export const userRepository = new UserRepository();
