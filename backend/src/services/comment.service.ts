import { Comment } from '../models/comment.model';
import { MeasureTime } from '../decorators/measure-time.decorator';
import {
  CommentRepository,
  commentRepository,
} from '../repositories/comment.repository';

export class CommentService {
  private readonly repository: CommentRepository;

  constructor(repository: CommentRepository = commentRepository) {
    this.repository = repository;
  }

  @MeasureTime()
  async getCommentsByCharacter(characterId: number): Promise<Comment[]> {
    try {
      return await this.repository.findByCharacterId(characterId);
    } catch (err) {
      console.error('[CommentService] getCommentsByCharacter error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async addComment(characterId: number, content: string): Promise<Comment> {
    try {
      return await this.repository.create(characterId, content);
    } catch (err) {
      console.error('[CommentService] addComment error:', err);
      throw err;
    }
  }

  @MeasureTime()
  async deleteComment(id: number): Promise<void> {
    try {
      await this.repository.softDelete(id);
    } catch (err) {
      console.error('[CommentService] deleteComment error:', err);
      throw err;
    }
  }
}

export const commentService = new CommentService();
