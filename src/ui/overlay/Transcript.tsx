import type { AnnounceableNode } from '../../core/types';
import { announce } from '../../core/announcer/announce';

export function Transcript({ nodes, index }: { nodes: AnnounceableNode[]; index: number }) {
  const current = nodes[index];
  // Guard the idle state (index -1): a negative `end` makes slice() count from the
  // tail, which would render almost the whole list as "history" before playback starts.
  const history = index > 0 ? nodes.slice(Math.max(0, index - 4), index) : [];
  return (
    <div className="aa-transcript">
      <ol className="aa-transcript-history">
        {history.map((n) => (
          <li key={n.id}>{announce(n)}</li>
        ))}
      </ol>
      <p className="aa-transcript-current" aria-live="off">
        {current ? announce(current) : 'Press play to start reading.'}
      </p>
    </div>
  );
}
