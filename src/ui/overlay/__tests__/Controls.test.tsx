import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Controls } from '../Controls';
import type { Player, PlayerState } from '../../../core/player/player';

function fakePlayer(state: PlayerState): Player {
  return {
    getState: () => state,
    subscribe: () => () => {},
    play: vi.fn(),
    pause: vi.fn(),
    next: vi.fn(),
    previous: vi.fn(),
    restart: vi.fn(),
    setRate: vi.fn(),
  };
}

describe('Controls', () => {
  it('calls play when idle and the play button is pressed', async () => {
    const player = fakePlayer({ status: 'idle', index: -1, rate: 1 });
    render(<Controls player={player} />);
    await userEvent.click(screen.getByLabelText('Play'));
    expect(player.play).toHaveBeenCalled();
  });

  it('shows a pause control while playing', () => {
    const player = fakePlayer({ status: 'playing', index: 0, rate: 1 });
    render(<Controls player={player} />);
    expect(screen.getByLabelText('Pause')).toBeTruthy();
  });

  it('changes rate via the slider', async () => {
    const player = fakePlayer({ status: 'idle', index: -1, rate: 1 });
    render(<Controls player={player} />);
    const slider = screen.getByLabelText('Speed') as HTMLInputElement;
    // range inputs: fire change directly via fireEvent so React's synthetic handler fires
    fireEvent.change(slider, { target: { value: '2' } });
    expect(player.setRate).toHaveBeenCalledWith(2);
  });
});
