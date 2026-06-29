import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Transcript } from '../Transcript';
import type { AnnounceableNode } from '../../../core/types';

const nodes: AnnounceableNode[] = [
  { id: '1', role: 'heading', name: 'Find a doctor', state: {}, level: 1 },
  { id: '2', role: 'textbox', name: 'Search', state: {} },
  { id: '3', role: 'button', name: 'Search', state: {} },
  { id: '4', role: 'link', name: 'Browse', state: {} },
];

describe('Transcript', () => {
  it('shows the prompt and no history before playback (idle index -1)', () => {
    const { container } = render(<Transcript nodes={nodes} index={-1} />);
    expect(screen.getByText('Press play to start reading.')).toBeTruthy();
    expect(container.querySelectorAll('.aa-transcript-history li')).toHaveLength(0);
  });

  it('shows no history at the first node', () => {
    const { container } = render(<Transcript nodes={nodes} index={0} />);
    expect(container.querySelectorAll('.aa-transcript-history li')).toHaveLength(0);
  });

  it('shows preceding nodes as history while reading', () => {
    const { container } = render(<Transcript nodes={nodes} index={2} />);
    expect(container.querySelectorAll('.aa-transcript-history li')).toHaveLength(2);
    expect(screen.getByText('Search, button')).toBeTruthy();
  });
});
