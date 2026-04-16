import { Character } from './character.model';
import { Comment } from './comment.model';
import { Favorite } from './favorite.model';

Character.hasMany(Comment, {
  foreignKey: 'characterId',
  as: 'comments',
  onDelete: 'CASCADE',
});
Comment.belongsTo(Character, {
  foreignKey: 'characterId',
  as: 'character',
});

Character.hasMany(Favorite, {
  foreignKey: 'characterId',
  as: 'favorites',
  onDelete: 'CASCADE',
});
Favorite.belongsTo(Character, {
  foreignKey: 'characterId',
  as: 'character',
});

export { Character, Comment, Favorite };
