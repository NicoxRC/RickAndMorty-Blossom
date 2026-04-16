import { useParams, Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import type {
  GetCharacterData,
  GetCharacterVariables,
} from '@/types/character.types';

const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      gender
      image
      origin {
        id
        name
      }
      location {
        id
        name
      }
    }
  }
`;

export function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error } = useQuery<
    GetCharacterData,
    GetCharacterVariables
  >(GET_CHARACTER, {
    variables: { id: id ?? '' },
    skip: !id,
  });

  if (loading) {
    return (
      <p className="text-center text-gray-400 text-sm animate-pulse">
        Loading…
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-sm text-center" role="alert">
        Error: {error.message}
      </p>
    );
  }

  const character = data?.character;

  if (!character) {
    return (
      <p className="text-center text-gray-400 text-sm">Character not found.</p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <Link
        to="/"
        className="text-sm text-green-600 hover:underline self-start"
      >
        &larr; Back to list
      </Link>

      <div className="flex flex-col sm:flex-row gap-6 bg-white rounded-xl shadow p-6 border border-gray-100">
        <img
          src={character.image}
          alt={character.name}
          className="w-48 h-48 rounded-lg object-cover self-center sm:self-start"
        />

        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-gray-900">{character.name}</h1>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <dt className="font-medium text-gray-500">Status</dt>
            <dd className="text-gray-800">{character.status}</dd>

            <dt className="font-medium text-gray-500">Species</dt>
            <dd className="text-gray-800">{character.species}</dd>

            <dt className="font-medium text-gray-500">Gender</dt>
            <dd className="text-gray-800">{character.gender}</dd>

            <dt className="font-medium text-gray-500">Origin</dt>
            <dd className="text-gray-800">{character.origin.name}</dd>

            <dt className="font-medium text-gray-500">Last known location</dt>
            <dd className="text-gray-800">{character.location.name}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
