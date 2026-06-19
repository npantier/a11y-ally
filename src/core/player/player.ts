import type { AnnounceableNode } from '../types';
import type { SpeechEngine } from '../speech/types';

export interface PlayerState {
  status: 'idle' | 'playing' | 'paused';
  index: number;
  rate: number;
}

export interface Player {
  getState(): PlayerState;
  subscribe(listener: () => void): () => void;
  play(): void;
  pause(): void;
  next(): void;
  previous(): void;
  restart(): void;
  setRate(rate: number): void;
}

interface PlayerDeps {
  nodes: AnnounceableNode[];
  engine: SpeechEngine;
  announce: (node: AnnounceableNode) => string;
}

export function createPlayer({ nodes, engine, announce }: PlayerDeps): Player {
  let state: PlayerState = { status: 'idle', index: -1, rate: 1 };
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((l) => l());
  const set = (patch: Partial<PlayerState>) => {
    state = { ...state, ...patch };
    emit();
  };

  const speakAt = (index: number) => {
    const node = nodes[index];
    if (!node) {
      set({ status: 'idle' });
      return;
    }
    set({ status: 'playing', index });
    engine.speak(announce(node), { rate: state.rate }, {
      onEnd: () => {
        if (state.status === 'playing') speakAt(state.index + 1);
      },
    });
  };

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    play() {
      if (state.status === 'paused') {
        engine.resume();
        set({ status: 'playing' });
        return;
      }
      speakAt(state.index < 0 ? 0 : state.index);
    },
    pause() {
      engine.pause();
      set({ status: 'paused' });
    },
    next() {
      speakAt(Math.max(0, Math.min(state.index + 1, nodes.length - 1)));
    },
    previous() {
      speakAt(Math.max(state.index - 1, 0));
    },
    restart() {
      speakAt(0);
    },
    setRate(rate) {
      set({ rate });
    },
  };
}
