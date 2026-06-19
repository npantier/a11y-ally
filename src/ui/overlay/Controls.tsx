import type { Player } from '../../core/player/player';
import { usePlayerState } from './usePlayer';
import { IconButton } from '../components/IconButton';
import { Slider } from '../components/Slider';

export function Controls({ player }: { player: Player }) {
  const state = usePlayerState(player);
  const playing = state.status === 'playing';

  return (
    <div className="aa-controls">
      <IconButton label="Previous" onClick={() => player.previous()}>⏮</IconButton>
      {playing ? (
        <IconButton label="Pause" onClick={() => player.pause()}>⏸</IconButton>
      ) : (
        <IconButton label="Play" onClick={() => player.play()}>▶</IconButton>
      )}
      <IconButton label="Next" onClick={() => player.next()}>⏭</IconButton>
      <IconButton label="Restart" onClick={() => player.restart()}>↺</IconButton>
      <Slider
        label="Speed"
        min={0.5}
        max={3}
        step={0.1}
        value={state.rate}
        onChange={(rate) => player.setRate(rate)}
      />
    </div>
  );
}
