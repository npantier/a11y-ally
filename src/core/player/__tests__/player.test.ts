import { describe, it, expect, vi } from 'vitest';
import { createPlayer } from '../player';
import type { SpeechEngine } from '../../speech/types';
import type { AnnounceableNode } from '../../types';

function fakeEngine() {
  let endHandler: (() => void) | undefined;
  const engine: SpeechEngine = {
    speak: vi.fn((_t, _o, h) => {
      endHandler = h.onEnd;
    }),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
  };
  return { engine, finish: () => endHandler?.() };
}

const nodes: AnnounceableNode[] = [
  { id: 'a', role: 'heading', name: 'One', level: 1, state: {} },
  { id: 'b', role: 'button', name: 'Two', state: {} },
];

const announce = (n: AnnounceableNode) => n.name;

describe('player', () => {
  it('plays from the first node', () => {
    const { engine } = fakeEngine();
    const player = createPlayer({ nodes, engine, announce });
    player.play();
    expect(player.getState()).toMatchObject({ status: 'playing', index: 0 });
    expect(engine.speak).toHaveBeenCalledWith('One', { rate: 1 }, expect.anything());
  });

  it('advances to the next node when the utterance ends', () => {
    const { engine, finish } = fakeEngine();
    const player = createPlayer({ nodes, engine, announce });
    player.play();
    finish();
    expect(player.getState().index).toBe(1);
    expect(engine.speak).toHaveBeenLastCalledWith('Two', { rate: 1 }, expect.anything());
  });

  it('stops at the end of the list', () => {
    const { engine, finish } = fakeEngine();
    const player = createPlayer({ nodes, engine, announce });
    player.play();
    finish(); // -> index 1
    finish(); // past the end
    expect(player.getState()).toMatchObject({ status: 'idle', index: 1 });
  });

  it('next and previous move the cursor and speak', () => {
    const { engine } = fakeEngine();
    const player = createPlayer({ nodes, engine, announce });
    player.next();
    expect(player.getState().index).toBe(0);
    player.next();
    expect(player.getState().index).toBe(1);
    player.previous();
    expect(player.getState().index).toBe(0);
  });

  it('pause and resume delegate to the engine', () => {
    const { engine } = fakeEngine();
    const player = createPlayer({ nodes, engine, announce });
    player.play();
    player.pause();
    expect(engine.pause).toHaveBeenCalled();
    expect(player.getState().status).toBe('paused');
    player.play();
    expect(engine.resume).toHaveBeenCalled();
    expect(player.getState().status).toBe('playing');
  });

  it('setRate updates state and is used for the next utterance', () => {
    const { engine } = fakeEngine();
    const player = createPlayer({ nodes, engine, announce });
    player.setRate(2);
    player.next();
    expect(player.getState().rate).toBe(2);
    expect(engine.speak).toHaveBeenCalledWith('One', { rate: 2 }, expect.anything());
  });

  it('notifies subscribers on state change', () => {
    const { engine } = fakeEngine();
    const player = createPlayer({ nodes, engine, announce });
    const listener = vi.fn();
    player.subscribe(listener);
    player.next();
    expect(listener).toHaveBeenCalled();
  });

  it('resumes the engine when next() is pressed from a paused state', () => {
    const { engine } = fakeEngine();
    const player = createPlayer({ nodes, engine, announce });
    player.play(); // playing, index 0
    player.pause(); // paused
    player.next(); // must resume + speak index 1
    expect(engine.resume).toHaveBeenCalled();
    expect(player.getState()).toMatchObject({ status: 'playing', index: 1 });
    expect(engine.speak).toHaveBeenLastCalledWith('Two', { rate: 1 }, expect.anything());
  });

  it('next() clamps at the last node and re-speaks it', () => {
    const { engine } = fakeEngine();
    const player = createPlayer({ nodes, engine, announce });
    player.next(); // -> 0
    player.next(); // -> 1 (last)
    player.next(); // clamped: stays at 1, re-speaks
    expect(player.getState()).toMatchObject({ status: 'playing', index: 1 });
    expect(engine.speak).toHaveBeenLastCalledWith('Two', { rate: 1 }, expect.anything());
  });

  it('ignores a late onEnd from a superseded utterance', () => {
    // Chrome fires onend for an utterance cancelled by a subsequent speak().
    // That stale callback must not auto-advance off the node now playing.
    const ends: Array<() => void> = [];
    const engine: SpeechEngine = {
      speak: vi.fn((_t, _o, h) => {
        if (h.onEnd) ends.push(h.onEnd);
      }),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
    };
    const player = createPlayer({ nodes, engine, announce });
    player.play(); // speak node 0 -> ends[0]
    player.next(); // supersede with node 1 -> ends[1], index now 1
    ends[0]?.(); // late onEnd from the cancelled node-0 utterance
    expect(player.getState()).toMatchObject({ status: 'playing', index: 1 });
  });

  it('ignores a late onEnd when the supersede re-speaks the same index', () => {
    // next() at the last node (and restart() in place) re-speaks the current
    // index. A plain index comparison would let the cancelled utterance's late
    // onEnd through and flip the player to idle; the generation tag must not.
    const ends: Array<() => void> = [];
    const engine: SpeechEngine = {
      speak: vi.fn((_t, _o, h) => {
        if (h.onEnd) ends.push(h.onEnd);
      }),
      cancel: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
    };
    const player = createPlayer({ nodes, engine, announce });
    player.play(); // node 0 -> ends[0]
    player.next(); // node 1 (last) -> ends[1], index 1
    player.next(); // clamped: re-speak node 1 -> ends[2], index still 1
    ends[1]?.(); // late onEnd from the superseded node-1 utterance
    expect(player.getState()).toMatchObject({ status: 'playing', index: 1 });
  });
});
