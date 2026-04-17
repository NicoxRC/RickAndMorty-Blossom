import React from 'react';
import type { Character, CharacterStatus } from '@/types/index';

interface CharacterCardProps {
  character: Character;
}

const statusStyles: Record<CharacterStatus, string> = {
  Alive: 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30',
  Dead: 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30',
  unknown: 'bg-zinc-500/20 text-zinc-400 ring-1 ring-zinc-500/30',
};

const statusDot: Record<CharacterStatus, string> = {
  Alive: 'bg-emerald-400',
  Dead: 'bg-red-400',
  unknown: 'bg-zinc-400',
};

export const CharacterCard = React.memo(function CharacterCard({ character }: CharacterCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 transition-all duration-200 hover:border-zinc-600 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={character.image}
          alt={character.name}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-200 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
      </div>

      <div className="flex flex-col gap-2 p-4">
        <h2 className="text-white font-semibold text-base leading-snug truncate">
          {character.name}
        </h2>

        <div className="flex items-center justify-between gap-2">
          <span className="text-zinc-400 text-sm truncate">{character.species}</span>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${statusStyles[character.status]}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot[character.status]}`} />
            {character.status}
          </span>
        </div>
      </div>
    </article>
  );
});
