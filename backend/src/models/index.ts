import { Character } from './character.model';
import { Comment } from './comment.model';
import { Favorite } from './favorite.model';
import { User } from './user.model';

Character.hasMany(Comment, {
  foreignKey: 'characterId',
  as: 'comments',
});

Comment.belongsTo(Character, {
  foreignKey: 'characterId',
  as: 'character',
});

Character.hasMany(Favorite, {
  foreignKey: 'characterId',
  as: 'favorites',
});

Favorite.belongsTo(Character, {
  foreignKey: 'characterId',
  as: 'character',
});

User.hasMany(Favorite, {
  foreignKey: 'userId',
  as: 'favorites',
  onDelete: 'CASCADE',
});

Favorite.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Comment, {
  foreignKey: 'userId',
  as: 'comments',
  onDelete: 'SET NULL',
});

Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export { Character, Comment, Favorite, User };
