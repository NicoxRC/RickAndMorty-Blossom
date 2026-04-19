export interface Comment {
  id: number;
  characterId: number;
  userId: number | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}
