import { useCallback, useRef } from 'react';
import { useError } from '@/context/ErrorContext';
import { UserModal } from '@/components/UserModal';
import { useState } from 'react';

function IconWarning() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-amber-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconLock() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-red-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconClose() {
  return (
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
  );
}

export function ErrorModal() {
  const { error, clearError } = useError();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === backdropRef.current) clearError();
    },
    [clearError],
  );

  const handleSignInClick = useCallback(() => {
    clearError();
    setIsUserModalOpen(true);
  }, [clearError]);

  if (!error) return null;

  const { message, type } = error;

  return (
    <>
      <div
        ref={backdropRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Error notification"
      >
        <div className="relative w-full max-w-sm mx-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden transition-all duration-200">
          <div className="flex items-center justify-between px-6 pt-6 pb-0">
            <div className="flex items-center gap-3">
              {type === 'permission' ? <IconLock /> : <IconWarning />}
              <h2 className="text-white font-semibold text-lg">
                {type === 'auth'
                  ? 'Login required'
                  : type === 'permission'
                    ? 'Permission denied'
                    : 'Something went wrong'}
              </h2>
            </div>

            <button
              type="button"
              onClick={clearError}
              aria-label="Close error"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200"
            >
              <IconClose />
            </button>
          </div>

          <div className="px-6 py-5 flex flex-col gap-5">
            {type === 'auth' && (
              <div className="flex flex-col gap-4">
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {message}
                </p>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-amber-300 text-xs leading-relaxed">
                    You need to be signed in to perform this action.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSignInClick}
                  className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition-all duration-200"
                >
                  Sign in
                </button>
              </div>
            )}

            {type === 'permission' && (
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-red-300 text-sm leading-relaxed">
                    {message}
                  </p>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Your account does not have the required permissions for this
                  action. Contact an administrator if you believe this is an
                  error.
                </p>
                <button
                  type="button"
                  onClick={clearError}
                  className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-300 text-sm font-medium transition-all duration-200"
                >
                  Dismiss
                </button>
              </div>
            )}

            {type === 'generic' && (
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-amber-200 text-sm leading-relaxed">
                    {message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearError}
                  className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-zinc-300 text-sm font-medium transition-all duration-200"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      />
    </>
  );
}
