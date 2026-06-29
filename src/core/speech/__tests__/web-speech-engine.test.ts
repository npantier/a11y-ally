import { describe, it, expect, vi } from 'vitest';
import { createWebSpeechEngine } from '../web-speech-engine';

class FakeUtterance {
  text: string;
  rate = 1;
  onstart: (() => void) | null = null;
  onend: (() => void) | null = null;
  onboundary: ((e: { charIndex: number }) => void) | null = null;
  constructor(text: string) {
    this.text = text;
  }
}

function fakeSynth() {
  const spoken: FakeUtterance[] = [];
  return {
    spoken,
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    speak: vi.fn((u: FakeUtterance) => spoken.push(u)),
  } as unknown as SpeechSynthesis & { spoken: FakeUtterance[] };
}

describe('createWebSpeechEngine', () => {
  it('speaks text at the given rate and fires onEnd', () => {
    const synth = fakeSynth() as any;
    (globalThis as any).SpeechSynthesisUtterance = FakeUtterance;
    const engine = createWebSpeechEngine(synth);

    const onEnd = vi.fn();
    engine.speak('Search, button', { rate: 1.5 }, { onEnd });

    const utterance = synth.spoken[0];
    expect(utterance.text).toBe('Search, button');
    expect(utterance.rate).toBe(1.5);

    utterance.onend!();
    expect(onEnd).toHaveBeenCalledOnce();
  });

  it('cancels before each new utterance so speech never overlaps', () => {
    const synth = fakeSynth() as any;
    (globalThis as any).SpeechSynthesisUtterance = FakeUtterance;
    const engine = createWebSpeechEngine(synth);
    engine.speak('one', { rate: 1 }, {});
    engine.speak('two', { rate: 1 }, {});
    expect(synth.cancel).toHaveBeenCalledTimes(2);
  });
});
