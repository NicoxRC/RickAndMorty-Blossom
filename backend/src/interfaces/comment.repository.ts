import type { Comment } from '@/models';

export interface ICommentRepository {
  findByCharacterId(characterId: number): Promise<Comment[]>;
  create(characterId: number, content: string): Promise<Comment>;
  softDelete(id: number): Promise<void>;
}
