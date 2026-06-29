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
  let generation = 0;
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
    const wasPaused = state.status === 'paused';
    set({ status: 'playing', index });
    if (wasPaused) engine.resume();
    // Guard against a stale onEnd: a cancelled utterance can still fire onend
    // (Chrome does). Tag each utterance with a generation so a superseded one's
    // late onEnd can't auto-advance off the node now playing — comparing the
    // index isn't enough, since a re-speak of the same index (next() at the end,
    // restart() in place) would match and slip through.
    const myGeneration = ++generation;
    engine.speak(
      announce(node),
      { rate: state.rate },
      {
        onEnd: () => {
          if (state.status === 'playing' && generation === myGeneration) {
            speakAt(index + 1);
          }
        },
      },
    );
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
