import { useSyncExternalStore } from 'react';
import type { Player, PlayerState } from '../../core/player/player';

export function usePlayerState(player: Player): PlayerState {
  return useSyncExternalStore(player.subscribe, player.getState);
}
