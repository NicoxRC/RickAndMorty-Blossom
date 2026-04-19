import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ErrorProvider } from '@/context/ErrorContext';
import { UserModal } from '@/components/UserModal';
import { ErrorModal } from '@/components/ErrorModal';

function NavBar() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-zinc-950 border-b border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <span className="font-bold text-green-500 text-lg tracking-tight select-none">
            Rick &amp; Morty
          </span>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            aria-label={user ? `Account: ${user.name}` : 'Sign in'}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/60 transition-all duration-200 group"
          >
            {user ? (
              <>
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-600/20 border border-green-600/30 shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-green-400"
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
                <span className="text-sm font-medium text-zinc-200 max-w-[120px] truncate hidden sm:block">
                  {user.name}
                </span>
                <RolePill role={user.role} />
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 shrink-0 group-hover:border-zinc-500 transition-all duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-all duration-200"
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
                <span className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-all duration-200 hidden sm:block">
                  Sign in
                </span>
              </>
            )}
          </button>
        </div>
      </nav>

      <UserModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

function RolePill({ role }: { role: 'ADMIN' | 'USER' }) {
  if (role === 'ADMIN') {
    return (
      <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide bg-violet-500/20 text-violet-400 ring-1 ring-violet-500/30">
        Admin
      </span>
    );
  }
  return (
    <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide bg-zinc-700/60 text-zinc-400 ring-1 ring-zinc-600/40">
      User
    </span>
  );
}

export function App() {
  return (
    <AuthProvider>
      <ErrorProvider>
        <div className="min-h-screen bg-zinc-950 text-gray-900">
          <NavBar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </main>
        </div>
        <ErrorModal />
      </ErrorProvider>
    </AuthProvider>
  );
}
