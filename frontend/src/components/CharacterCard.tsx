import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { StatusBadge } from '@/components/StatusBadge';
import { SOFT_DELETE_CHARACTER } from '@/graphql/mutations';
import { useAuth } from '@/context/AuthContext';
import { useError } from '@/context/ErrorContext';

import type { Character } from '@/types/index';
import type {
  SoftDeleteCharacterData,
  SoftDeleteCharacterVars,
} from '@/types/graphql.types';

interface CharacterCardProps {
  character: Character;
  onDelete: (id: number) => void;
}

export const CharacterCard = React.memo(function CharacterCard({
  character,
  onDelete,
}: CharacterCardProps) {
  const { user } = useAuth();
  const { showError } = useError();

  const [softDelete, { loading: deleting }] = useMutation<
    SoftDeleteCharacterData,
    SoftDeleteCharacterVars
  >(SOFT_DELETE_CHARACTER);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showError('Login required to delete characters', 'auth');
      return;
    }

    const confirmed = window.confirm(`Delete ${character.name}?`);
    if (!confirmed) return;

    try {
      await softDelete({ variables: { id: character.id, userId: user.id } });
      onDelete(character.id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete character';
      showError(message);
    }
  };

  return (
    <Link
      to={`/character/${character.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 transition-all duration-200 hover:border-zinc-600 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5"
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={character.image}
          alt={character.name}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-200 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          aria-label={`Delete ${character.name}`}
          className="absolute bottom-2 right-2 flex items-center justify-center w-8 h-8 rounded-lg
            bg-zinc-900/80 border border-zinc-700 text-zinc-400
            opacity-0 group-hover:opacity-100
            hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 backdrop-blur-sm"
        >
          {deleting ? (
            <svg
              className="w-3.5 h-3.5 animate-spin"
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
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h2 className="text-white font-semibold text-base leading-snug truncate">
          {character.name}
        </h2>

        <div className="flex items-center justify-between gap-2">
          <span className="text-zinc-400 text-sm truncate">
            {character.species}
          </span>

          <StatusBadge status={character.status} />
        </div>
      </div>
    </Link>
  );
});
