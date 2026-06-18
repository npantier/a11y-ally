import type { AnnounceableNode, NodeState } from '../types';
import { ROLE_LABELS } from './role-labels';

export function announce(node: AnnounceableNode): string {
  const parts: string[] = [];

  if (node.name) parts.push(node.name);

  if (node.role === 'heading') {
    parts.push(`heading level ${node.level ?? 2}`);
  } else {
    const label = ROLE_LABELS[node.role];
    if (label) parts.push(label);
  }

  parts.push(...stateParts(node.state));

  if (node.value) parts.push(node.value);

  if (node.setInfo) parts.push(`${node.setInfo.position} of ${node.setInfo.size}`);

  return parts.join(', ');
}

function stateParts(state: NodeState): string[] {
  const out: string[] = [];
  if (state.checked === 'mixed') out.push('partially checked');
  else if (state.checked === true) out.push('checked');
  else if (state.checked === false) out.push('not checked');
  if (state.expanded === true) out.push('expanded');
  else if (state.expanded === false) out.push('collapsed');
  if (state.selected) out.push('selected');
  if (state.disabled) out.push('dimmed');
  if (state.required) out.push('required');
  return out;
}
