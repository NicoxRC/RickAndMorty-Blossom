import React from 'react';
import { render, screen } from '@testing-library/react';
import type { Character } from '@/types/index';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    Link: ({ to, children, ...rest }: { to: string; children: React.ReactNode; [key: string]: unknown }) => (
      <a href={to as string} {...rest}>
        {children}
      </a>
    ),
  };
});

vi.mock('@apollo/client', async () => {
  const actual = await vi.importActual<typeof import('@apollo/client')>('@apollo/client');
  return {
    ...actual,
    useMutation: vi.fn(() => [vi.fn(), { loading: false }]),
  };
});

import { CharacterCard } from '@/components/CharacterCard';

const mockCharacter: Character = {
  id: 1,
  externalId: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://example.com/rick.png',
  origin: 'Earth',
  location: 'Earth',
  deletedAt: null,
  createdAt: '2021-01-01',
  updatedAt: '2021-01-01',
  comments: [],
  isFavorite: false,
};

const mockOnDelete = vi.fn();

describe('CharacterCard', () => {
  it('renders character name', () => {
    render(<CharacterCard character={mockCharacter} onDelete={mockOnDelete} />);
    expect(screen.getByRole('heading', { name: 'Rick Sanchez' })).toBeInTheDocument();
  });

  it('renders character image with correct alt text', () => {
    render(<CharacterCard character={mockCharacter} onDelete={mockOnDelete} />);
    const img = screen.getByRole('img', { name: 'Rick Sanchez' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockCharacter.image);
  });

  it('renders character species', () => {
    render(<CharacterCard character={mockCharacter} onDelete={mockOnDelete} />);
    expect(screen.getByText('Human')).toBeInTheDocument();
  });

  it('clicking the card link navigates to /character/:id', async () => {
    render(<CharacterCard character={mockCharacter} onDelete={mockOnDelete} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/character/${mockCharacter.id}`);
  });
});
