import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type ErrorType = 'auth' | 'permission' | 'generic';

interface ErrorState {
  message: string;
  type: ErrorType;
}

interface ErrorContextValue {
  error: ErrorState | null;
  showError: (message: string, type?: ErrorType) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextValue | null>(null);

export function detectErrorType(message: string): ErrorType {
  const lower = message.toLowerCase();

  if (
    (lower.includes('user') && lower.includes('not found')) ||
    lower.includes('no session') ||
    lower.includes('not logged')
  ) {
    return 'auth';
  }

  if (
    lower.includes('forbidden') ||
    lower.includes('only users with role') ||
    lower.includes('admin')
  ) {
    return 'permission';
  }

  return 'generic';
}

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<ErrorState | null>(null);

  const showError = useCallback((message: string, type?: ErrorType) => {
    setError({ message, type: type ?? detectErrorType(message) });
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<ErrorContextValue>(
    () => ({ error, showError, clearError }),
    [error, showError, clearError],
  );

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
}

export function useError(): ErrorContextValue {
  const ctx = useContext(ErrorContext);
  if (!ctx) {
    throw new Error('useError must be used within <ErrorProvider>');
  }
  return ctx;
}
