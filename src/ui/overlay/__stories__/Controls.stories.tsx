import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Player, PlayerState } from '../../../core/player/player';
import { Controls } from '../Controls';

// A self-contained fake Player so the controls are fully interactive in the workbench
// (play/pause toggles, speed slider updates) without wiring a real speech engine.
function createFakePlayer(initial: PlayerState): Player {
  let state = initial;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((listener) => listener());
  const set = (patch: Partial<PlayerState>) => {
    state = { ...state, ...patch };
    emit();
  };
  return {
    getState: () => state,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    play: () => set({ status: 'playing' }),
    pause: () => set({ status: 'paused' }),
    next: () => set({ index: state.index + 1 }),
    previous: () => set({ index: Math.max(0, state.index - 1) }),
    restart: () => set({ status: 'playing', index: 0 }),
    setRate: (rate) => set({ rate }),
  };
}

const meta: Meta<typeof Controls> = {
  title: 'Overlay/Controls',
  component: Controls,
};

export default meta;
type Story = StoryObj<typeof Controls>;

export const Idle: Story = {
  args: { player: createFakePlayer({ status: 'idle', index: -1, rate: 1 }) },
};

export const Playing: Story = {
  args: { player: createFakePlayer({ status: 'playing', index: 2, rate: 1.5 }) },
};
