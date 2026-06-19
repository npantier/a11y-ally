import type { AnnounceableNode } from '../../core/types';
import { announce } from '../../core/announcer/announce';

export function Transcript({ nodes, index }: { nodes: AnnounceableNode[]; index: number }) {
  const current = nodes[index];
  const history = nodes.slice(Math.max(0, index - 4), index);
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
