import type { SpeechEngine, SpeechHandlers } from './types';

export function createWebSpeechEngine(
  synth: SpeechSynthesis = window.speechSynthesis,
): SpeechEngine {
  return {
    speak(text, opts, handlers: SpeechHandlers) {
      synth.cancel(); // never overlap utterances
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = opts.rate;
      utterance.onstart = () => handlers.onStart?.();
      utterance.onend = () => handlers.onEnd?.();
      utterance.onboundary = (event) => handlers.onBoundary?.(event.charIndex);
      synth.speak(utterance);
    },
    cancel() {
      synth.cancel();
    },
    pause() {
      synth.pause();
    },
    resume() {
      synth.resume();
    },
  };
}
