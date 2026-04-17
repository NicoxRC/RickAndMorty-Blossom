import { render, screen, fireEvent, act } from '@testing-library/react';
import type { CharacterFiltersInput } from '@/types/index';

const mockRefetch = vi.fn();
const mockUseQuery = vi.fn();

vi.mock('@apollo/client', async () => {
  const actual =
    await vi.importActual<typeof import('@apollo/client')>('@apollo/client');
  return {
    ...actual,
    useQuery: (...args: unknown[]) => mockUseQuery(...args),
  };
});

vi.mock('@/components/CharacterCard', () => ({
  CharacterCard: () => null,
}));

import { CharactersPage } from '@/pages/CharactersPage';

type UseQueryCall = [
  unknown,
  { variables: { filters: CharacterFiltersInput } },
];

function lastCallFilters(): CharacterFiltersInput {
  const calls = mockUseQuery.mock.calls as UseQueryCall[];
  return calls[calls.length - 1][1]?.variables?.filters ?? {};
}

describe('CharactersPage — filter inputs and debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockUseQuery.mockReturnValue({
      data: { characters: [] },
      loading: false,
      error: undefined,
      refetch: mockRefetch,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('debounces species input — does not include species before 300ms, includes it after', () => {
    render(<CharactersPage />);

    const speciesInput = screen.getByRole('textbox', {
      name: /filter by species/i,
    });

    fireEvent.change(speciesInput, { target: { value: 'Human' } });

    expect(lastCallFilters().species).toBeUndefined();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(lastCallFilters().species).toBe('Human');
  });

  it('status dropdown fires useQuery immediately with correct variable', () => {
    render(<CharactersPage />);

    const statusSelect = screen.getByRole('combobox', {
      name: /filter by status/i,
    });

    act(() => {
      fireEvent.change(statusSelect, { target: { value: 'Alive' } });
    });

    expect(lastCallFilters().status).toBe('Alive');
  });

  it('gender dropdown fires useQuery immediately with correct variable', () => {
    render(<CharactersPage />);

    const genderSelect = screen.getByRole('combobox', {
      name: /filter by gender/i,
    });

    act(() => {
      fireEvent.change(genderSelect, { target: { value: 'Female' } });
    });

    expect(lastCallFilters().gender).toBe('Female');
  });
});
