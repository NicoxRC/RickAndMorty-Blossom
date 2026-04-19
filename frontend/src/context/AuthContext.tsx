import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { Role } from '@/types/index';

interface AuthUser {
  id: number;
  name: string;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readFromStorage(): AuthUser | null {
  try {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('username');
    const role = localStorage.getItem('userRole') as Role | null;
    if (id && name && (role === 'ADMIN' || role === 'USER')) {
      return { id: Number(id), name, role };
    }
  } catch {}
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readFromStorage);

  const login = useCallback((incoming: AuthUser) => {
    try {
      localStorage.setItem('userId', String(incoming.id));
      localStorage.setItem('username', incoming.name);
      localStorage.setItem('userRole', incoming.role);
    } catch {}
    setUser(incoming);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
    } catch {}
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, login, logout }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>');
  }
  return ctx;
}
