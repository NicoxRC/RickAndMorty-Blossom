import { useQuery } from '@apollo/client';
import { CharacterCard } from '@/components/CharacterCard';
import { GET_CHARACTERS } from '@/graphql/queries';
import type { Character } from '@/types/index';

interface GetCharactersData {
  characters: Character[];
}

export function CharactersPage() {
  const { data, loading, error } = useQuery<GetCharactersData>(GET_CHARACTERS);

  return (
    <div className="flex flex-col gap-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Rick &amp; Morty Characters
        </h1>
      </header>

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

      {!loading && !error && data?.characters.length === 0 && (
        <div className="flex justify-center py-20">
          <p className="text-zinc-500 text-sm">No characters found.</p>
        </div>
      )}

      {data?.characters && data.characters.length > 0 && (
        <section
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          aria-label="Character list"
        >
          {data.characters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </section>
      )}
    </div>
  );
}
