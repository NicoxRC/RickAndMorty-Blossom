export interface Comment {
  id: number;
  characterId: number;
  userId: number | null;
  userName: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}
