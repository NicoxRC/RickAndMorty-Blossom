import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { CharacterCard } from '@/components/CharacterCard';
import { GET_CHARACTERS } from '@/graphql/queries';
import type {
  Character,
  CharacterStatus,
  CharacterGender,
  CharacterFiltersInput,
  GetCharactersData,
  GetCharactersVars,
} from '@/types/index';

const selectClass =
  'w-full rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm px-3 py-2 outline-none ' +
  'focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition-all duration-200 cursor-pointer';

const inputClass =
  'w-full rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm px-3 py-2 outline-none ' +
  'placeholder:text-zinc-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40 transition-all duration-200';

export function CharactersPage() {
  const [status, setStatus] = useState<CharacterStatus | ''>('');
  const [speciesRaw, setSpeciesRaw] = useState('');
  const [debouncedSpecies, setDebouncedSpecies] = useState('');
  const [gender, setGender] = useState<CharacterGender | ''>('');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSpecies(speciesRaw.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [speciesRaw]);

  const filters: CharacterFiltersInput = {
    ...(status ? { status } : {}),
    ...(debouncedSpecies ? { species: debouncedSpecies } : {}),
    ...(gender ? { gender } : {}),
  };

  const { data, loading, error, refetch } = useQuery<
    GetCharactersData,
    GetCharactersVars
  >(GET_CHARACTERS, {
    variables: { filters },
  });

  const handleDelete = () => {
    refetch();
  };

  const sortedCharacters: Character[] = data?.characters
    ? [...data.characters].sort((a, b) =>
        sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
      )
    : [];

  return (
    <div className="flex flex-col gap-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Rick &amp; Morty Characters
        </h1>
      </header>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as CharacterStatus | '')}
          className={selectClass}
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="Alive">Alive</option>
          <option value="Dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>

        <input
          type="text"
          value={speciesRaw}
          onChange={(e) => setSpeciesRaw(e.target.value)}
          placeholder="Filter by species..."
          className={inputClass}
          aria-label="Filter by species"
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as CharacterGender | '')}
          className={selectClass}
          aria-label="Filter by gender"
        >
          <option value="">All Genders</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Genderless">Genderless</option>
          <option value="unknown">Unknown</option>
        </select>

        <button
          type="button"
          onClick={() => setSortAsc((prev) => !prev)}
          className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900
            px-4 py-2 text-sm font-medium text-zinc-300 hover:border-violet-500 hover:text-white
            transition-all duration-200 whitespace-nowrap"
          aria-label={sortAsc ? 'Sort Z to A' : 'Sort A to Z'}
        >
          <span>{sortAsc ? 'A → Z' : 'Z → A'}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 transition-transform duration-200 ${sortAsc ? '' : 'rotate-180'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L11 6.414V16a1 1 0 11-2 0V6.414L6.707 8.707A1 1 0 015.293 7.293l4-4A1 1 0 0110 3z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="flex justify-center py-20">
          <p
            className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-6 py-4"
            role="alert"
          >
            Failed to load characters: {error.message}
          </p>
        </div>
      )}

      {!loading && !error && sortedCharacters.length === 0 && (
        <div className="flex justify-center py-20">
          <p className="text-zinc-500 text-sm">No characters found.</p>
        </div>
      )}

      {sortedCharacters.length > 0 && (
        <section
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          aria-label="Character list"
        >
          {sortedCharacters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              onDelete={handleDelete}
            />
          ))}
        </section>
      )}
    </div>
  );
}
