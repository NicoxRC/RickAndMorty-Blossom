import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import { GET_USER_BY_NAME } from '@/graphql/queries';
import { CREATE_USER } from '@/graphql/mutations';
import { useAuth } from '@/context/AuthContext';

import type {
  GetUserByNameData,
  GetUserByNameVars,
  CreateUserData,
  CreateUserVars,
} from '@/types/index';
import type { Role } from '@/types/index';

type Tab = 'login' | 'register';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserModal({ isOpen, onClose }: UserModalProps) {
  const { login, logout, user } = useAuth();
  const [tab, setTab] = useState<Tab>('login');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('USER');
  const [error, setError] = useState<string | null>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setRole('USER');
      setError(null);
    }
  }, [isOpen, tab]);

  const [getUserByName, { loading: loginLoading }] = useLazyQuery<
    GetUserByNameData,
    GetUserByNameVars
  >(GET_USER_BY_NAME, { fetchPolicy: 'network-only' });

  const [createUser, { loading: registerLoading }] = useMutation<
    CreateUserData,
    CreateUserVars
  >(CREATE_USER);

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      const trimmed = name.trim();
      if (!trimmed) {
        setError('Please enter a username.');
        return;
      }
      try {
        const result = await getUserByName({ variables: { name: trimmed } });
        const found = result.data?.userByName;
        if (!found) {
          setError('User not found. Try registering instead.');
          return;
        }
        login({ id: found.id, name: found.name, role: found.role });
        onClose();
      } catch {
        setError('Something went wrong. Please try again.');
      }
    },
    [name, getUserByName, login, onClose],
  );

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      const trimmed = name.trim();
      if (!trimmed) {
        setError('Please enter a username.');
        return;
      }
      try {
        const result = await createUser({ variables: { name: trimmed, role } });
        const created = result.data?.createUser;
        if (!created) {
          setError('Registration failed. Please try again.');
          return;
        }
        login({ id: created.id, name: created.name, role: created.role });
        onClose();
      } catch (err) {
        const msg = err instanceof Error ? err.message : '';
        if (
          msg.toLowerCase().includes('already') ||
          msg.toLowerCase().includes('unique')
        ) {
          setError('A user with that name already exists.');
        } else {
          setError('Something went wrong. Please try again.');
        }
      }
    },
    [name, role, createUser, login, onClose],
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === backdropRef.current) onClose();
    },
    [onClose],
  );

  const handleTabChange = useCallback((next: Tab) => {
    setTab(next);
    setError(null);
    setName('');
  }, []);

  if (!isOpen) return null;

  const isLoading = loginLoading || registerLoading;

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="User authentication"
    >
      <div className="relative w-full max-w-sm mx-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden transition-all duration-200">
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          <h2 className="text-white font-semibold text-lg">
            {user ? 'Account' : 'Sign in'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {user ? (
          <div className="px-6 py-6 flex flex-col gap-5">
            <div className="flex items-center gap-4 p-4 bg-zinc-800/60 rounded-xl border border-zinc-700/50">
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-green-500/20 border border-green-500/30 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-white font-semibold text-sm truncate">
                  {user.name}
                </span>
                <RoleBadge role={user.role} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-red-500/20 border border-zinc-700 hover:border-red-500/40 text-zinc-300 hover:text-red-400 text-sm font-medium transition-all duration-200"
            >
              Sign out
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-1 px-6 pt-4">
              {(['login', 'register'] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTabChange(t)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize ${
                    tab === t
                      ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                      : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                  }`}
                >
                  {t === 'login' ? 'Log in' : 'Register'}
                </button>
              ))}
            </div>

            <form
              onSubmit={tab === 'login' ? handleLogin : handleRegister}
              className="px-6 py-5 flex flex-col gap-4"
              noValidate
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="auth-name"
                  className="text-xs font-medium text-zinc-400 uppercase tracking-wider"
                >
                  Username
                </label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(null);
                  }}
                  placeholder="e.g. Rick Sanchez"
                  autoComplete="off"
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-green-600/60 focus:ring-1 focus:ring-green-600/30 transition-all duration-200"
                />
              </div>

              {tab === 'register' && (
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="auth-role"
                    className="text-xs font-medium text-zinc-400 uppercase tracking-wider"
                  >
                    Role
                  </label>
                  <select
                    id="auth-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-green-600/60 focus:ring-1 focus:ring-green-600/30 transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              )}

              {error && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    {tab === 'login' ? 'Signing in…' : 'Creating account…'}
                  </>
                ) : tab === 'login' ? (
                  'Sign in'
                ) : (
                  'Create account'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: Role }) {
  const styles: Record<Role, string> = {
    ADMIN: 'bg-violet-500/20 text-violet-400 ring-1 ring-violet-500/30',
    USER: 'bg-zinc-700/60 text-zinc-400 ring-1 ring-zinc-600/40',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide w-fit ${styles[role]}`}
    >
      {role}
    </span>
  );
}
