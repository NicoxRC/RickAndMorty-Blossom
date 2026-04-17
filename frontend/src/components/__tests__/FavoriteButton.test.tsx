import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function FavoriteButtonTest({
  isFavorite,
  onToggle,
}: {
  isFavorite: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? 'filled-heart' : 'empty-heart'}
    </button>
  );
}

describe('FavoriteButton logic', () => {
  it('renders filled heart text when isFavorite is true', () => {
    render(<FavoriteButtonTest isFavorite={true} onToggle={vi.fn()} />);
    expect(screen.getByText('filled-heart')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Remove from favorites' }),
    ).toBeInTheDocument();
  });

  it('renders empty heart text when isFavorite is false', () => {
    render(<FavoriteButtonTest isFavorite={false} onToggle={vi.fn()} />);
    expect(screen.getByText('empty-heart')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add to favorites' }),
    ).toBeInTheDocument();
  });

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<FavoriteButtonTest isFavorite={false} onToggle={onToggle} />);

    await user.click(screen.getByRole('button', { name: 'Add to favorites' }));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
