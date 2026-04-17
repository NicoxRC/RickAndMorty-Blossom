import type { CharacterStatus } from '@/types/index';

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

interface StatusBadgeProps {
  status: CharacterStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const padding = size === 'md' ? 'px-3 py-1' : 'px-2.5 py-0.5';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full text-xs font-medium shrink-0 ${padding} ${statusStyles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />
      {status}
    </span>
  );
}
