import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CHARACTER_DETAIL } from '@/graphql/queries';
import { TOGGLE_FAVORITE, ADD_COMMENT } from '@/graphql/mutations';
import type {
  GetCharacterDetailData,
  GetCharacterDetailVars,
  ToggleFavoriteData,
  ToggleFavoriteVars,
  AddCommentData,
  AddCommentVars,
} from '@/types/index';
import { StatusBadge } from '@/components/StatusBadge';

function formatDate(value: string): string {
  const ms = Number(value);
  const date = isNaN(ms) ? new Date(value) : new Date(ms);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const characterId = parseInt(id ?? '', 10);

  const [commentText, setCommentText] = useState('');

  const { data, loading, error } = useQuery<
    GetCharacterDetailData,
    GetCharacterDetailVars
  >(GET_CHARACTER_DETAIL, {
    variables: { id: characterId },
    skip: !id,
  });

  const [toggleFavorite] = useMutation<ToggleFavoriteData, ToggleFavoriteVars>(
    TOGGLE_FAVORITE,
    {
      variables: { characterId },
      optimisticResponse: data?.character
        ? {
            toggleFavorite: { added: !data.character.isFavorite },
          }
        : undefined,
      update(cache) {
        const cached = cache.readQuery<GetCharacterDetailData>({
          query: GET_CHARACTER_DETAIL,
          variables: { id: characterId },
        });
        if (!cached) return;
        cache.writeQuery<GetCharacterDetailData>({
          query: GET_CHARACTER_DETAIL,
          variables: { id: characterId },
          data: {
            character: {
              ...cached.character,
              isFavorite: !cached.character.isFavorite,
            },
          },
        });
      },
    },
  );

  const [addComment, { loading: addingComment }] = useMutation<
    AddCommentData,
    AddCommentVars
  >(ADD_COMMENT, {
    update(cache, { data: mutationData }) {
      if (!mutationData) return;
      const cached = cache.readQuery<GetCharacterDetailData>({
        query: GET_CHARACTER_DETAIL,
        variables: { id: characterId },
      });
      if (!cached) return;
      cache.writeQuery<GetCharacterDetailData>({
        query: GET_CHARACTER_DETAIL,
        variables: { id: characterId },
        data: {
          character: {
            ...cached.character,
            comments: [...cached.character.comments, mutationData.addComment],
          },
        },
      });
    },
    onCompleted() {
      setCommentText('');
    },
  });

  const handleToggleFavorite = () => {
    void toggleFavorite();
  };

  const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;
    void addComment({ variables: { characterId, content: trimmed } });
  };

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-20">
        <p
          className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-6 py-4"
          role="alert"
        >
          Failed to load character: {error.message}
        </p>
      </div>
    );
  }

  const character = data?.character;

  if (!character) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-zinc-500 text-sm">Character not found.</p>
      </div>
    );
  }

  const sortedComments = [...character.comments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 self-start text-sm text-zinc-400
          hover:text-white transition-all duration-200"
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
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to list
      </Link>

      <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
        <div className="relative w-full aspect-[16/7] sm:aspect-[16/6]">
          <img
            src={character.image}
            alt={character.name}
            loading="lazy"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={
              character.isFavorite
                ? 'Remove from favorites'
                : 'Add to favorites'
            }
            className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-xl
              bg-zinc-900/80 border border-zinc-700 backdrop-blur-sm
              hover:border-amber-500/50 hover:bg-amber-500/10
              transition-all duration-200"
          >
            {character.isFavorite ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-amber-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>

          <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 flex items-end justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              {character.name}
            </h1>
            <StatusBadge status={character.status} size="md" />
          </div>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-zinc-800">
          {[
            { label: 'Species', value: character.species },
            { label: 'Gender', value: character.gender },
            { label: 'Origin', value: character.origin },
            { label: 'Location', value: character.location },
            { label: 'External ID', value: String(character.externalId) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-zinc-900 px-5 py-4">
              <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                {label}
              </dt>
              <dd
                className="text-sm text-white font-medium truncate"
                title={value}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold text-white">
          Comments{' '}
          <span className="text-zinc-500 font-normal text-sm">
            ({sortedComments.length})
          </span>
        </h2>

        {sortedComments.length === 0 ? (
          <p className="text-zinc-500 text-sm py-4 text-center">
            No comments yet. Be the first to comment.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {sortedComments.map((comment) => (
              <li
                key={comment.id}
                className="rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-4 flex flex-col gap-1"
              >
                <p className="text-sm text-zinc-200 leading-relaxed">
                  {comment.content}
                </p>
                <time
                  dateTime={comment.createdAt}
                  className="text-xs text-zinc-500"
                >
                  {formatDate(comment.createdAt)}
                </time>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={handleAddComment}
          className="flex flex-col gap-3 rounded-xl bg-zinc-900 border border-zinc-800 p-5"
        >
          <label
            htmlFor="comment-input"
            className="text-sm font-medium text-zinc-300"
          >
            Add a comment
          </label>
          <textarea
            id="comment-input"
            rows={3}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write something..."
            disabled={addingComment}
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3
              placeholder:text-zinc-500 outline-none resize-none
              focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200"
          />
          <button
            type="submit"
            disabled={addingComment || commentText.trim() === ''}
            className="self-end inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium
              bg-violet-600 text-white
              hover:bg-violet-500
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200"
          >
            {addingComment ? (
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
                Posting…
              </>
            ) : (
              'Post comment'
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
