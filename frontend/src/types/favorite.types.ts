export interface Favorite {
  id: number;
  characterId: number;
  userId: number;
  createdAt: string;
}

export interface ToggleFavoriteResult {
  added: boolean;
}
