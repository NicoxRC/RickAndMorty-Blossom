import { Comment } from '@/models';
import { MeasureTime } from '@/decorators/measure-time.decorator';
import { ICommentRepository } from '@/interfaces/comment.repository';

export class CommentRepository implements ICommentRepository {
  @MeasureTime()
  async findByCharacterId(characterId: number): Promise<Comment[]> {
    try {
      return await Comment.findAll({ where: { characterId } });
    } catch (err) {
      console.error('[CommentRepository] findByCharacterId error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async create(
    characterId: number,
    content: string,
    userId?: number,
  ): Promise<Comment> {
    try {
      if (userId) {
        return await Comment.create({ characterId, content, userId });
      }
      return await Comment.create({ characterId, content });
    } catch (err) {
      console.error('[CommentRepository] create error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async softDelete(id: number): Promise<void> {
    try {
      await Comment.destroy({ where: { id } });
    } catch (err) {
      console.error('[CommentRepository] softDelete error:', err);
      throw err;
    }
  }
}

export const commentRepository = new CommentRepository();
