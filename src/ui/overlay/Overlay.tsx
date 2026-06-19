import { useEffect } from 'react';
import type { Player } from '../../core/player/player';
import type { AnnounceableNode } from '../../core/types';
import { Controls } from './Controls';
import { Transcript } from './Transcript';
import { usePlayerState } from './usePlayer';

interface OverlayProps {
  player: Player;
  nodes: AnnounceableNode[];
  onCurrentChange: (node: AnnounceableNode | undefined) => void;
}

export function Overlay({ player, nodes, onCurrentChange }: OverlayProps) {
  const state = usePlayerState(player);

  useEffect(() => {
    onCurrentChange(nodes[state.index]);
  }, [state.index, nodes, onCurrentChange]);

  return (
    <div className="aa-overlay" role="region" aria-label="a11y-ally screen reader simulator">
      <header className="aa-overlay-header">a11y-ally</header>
      <Transcript nodes={nodes} index={state.index} />
      <Controls player={player} />
    </div>
  );
}
