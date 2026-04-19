import type { User } from '@/models';
import type { Role } from '@/types/user.types';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByName(name: string): Promise<User | null>;
  create(user: string, role: Role): Promise<User>;
}
