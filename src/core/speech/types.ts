export interface SpeechHandlers {
  onStart?: () => void;
  onEnd?: () => void;
  /** charIndex into the spoken string; only fires when the voice supports boundaries. */
  onBoundary?: (charIndex: number) => void;
}

export interface SpeechEngine {
  speak(text: string, opts: { rate: number }, handlers: SpeechHandlers): void;
  cancel(): void;
  pause(): void;
  resume(): void;
}
