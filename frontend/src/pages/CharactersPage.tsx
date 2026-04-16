import { useState } from 'react';
import { SearchFilters } from '@/components/SearchFilters';
import { CharacterCard } from '@/components/CharacterCard';
import { useCharacters } from '@/hooks/useCharacters';
import type { CharacterFilters } from '@/types/character.types';

const INITIAL_FILTERS: CharacterFilters = {
  name: '',
  status: '',
  species: '',
  gender: '',
};

export function CharactersPage() {
  const [filters, setFilters] = useState<CharacterFilters>(INITIAL_FILTERS);
  const { characters, loading, error } = useCharacters(filters);

  return (
    <div className="flex flex-col gap-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Rick &amp; Morty Characters
        </h1>
        <p className="mt-1 text-gray-500 text-sm">
          Search across the multiverse
        </p>
      </header>

      <SearchFilters filters={filters} onChange={setFilters} />

      {error && (
        <p className="text-red-500 text-sm text-center" role="alert">
          Failed to load characters: {error.message}
        </p>
      )}

      {loading && !characters.length && (
        <p className="text-center text-gray-400 text-sm animate-pulse">
          Loading…
        </p>
      )}

      <section
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        aria-label="Character list"
      >
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </section>

      {!loading && !error && characters.length === 0 && (
        <p className="text-center text-gray-400 text-sm">
          No characters found. Try adjusting your filters.
        </p>
      )}
    </div>
  );
}
