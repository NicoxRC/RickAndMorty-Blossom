import type { Character } from './character.types';
import type { CharacterFiltersInput } from './character.types';
import type { Comment } from './comment.types';
import type { ToggleFavoriteResult } from './favorite.types';
import type { Role, User } from './user.types';

// ── Characters ───────────────────────────────────────────────────────────────

export interface GetCharactersData {
  characters: Character[];
}

export interface GetCharactersVars {
  filters?: CharacterFiltersInput;
  userId?: number;
}

export interface GetCharacterDetailData {
  character: Character;
}

export interface GetCharacterDetailVars {
  id: number;
  userId?: number;
}

// ── Favorites ────────────────────────────────────────────────────────────────

export interface ToggleFavoriteData {
  toggleFavorite: ToggleFavoriteResult;
}

export interface ToggleFavoriteVars {
  characterId: number;
  userId?: number;
}

// ── Comments ─────────────────────────────────────────────────────────────────

export interface AddCommentData {
  addComment: Comment;
}

export interface AddCommentVars {
  characterId: number;
  content: string;
  userId?: number;
}

// ── Users ────────────────────────────────────────────────────────────────────

export interface GetUserByNameData {
  userByName: User | null;
}

export interface GetUserByNameVars {
  name: string;
}

export interface CreateUserData {
  createUser: User;
}

export interface CreateUserVars {
  name: string;
  role: Role;
}
