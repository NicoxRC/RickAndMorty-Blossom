export type Role = 'ADMIN' | 'USER';

export interface User {
  id: number;
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUser {
  userId: number | null;
  setUserId: (id: number) => void;
  clearUserId: () => void;
}
