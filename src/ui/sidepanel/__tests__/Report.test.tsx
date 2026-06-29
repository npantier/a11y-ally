import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Report } from '../Report';
import type { ReportModel } from '../../../core/audit/types';

const model: ReportModel = {
  summary: { critical: 1, serious: 0, moderate: 1, minor: 0, passes: 7 },
  findings: [
    {
      ruleId: 'image-alt',
      impact: 'critical',
      description: 'Images need alt',
      helpUrl: 'https://x',
      nodes: [{ selector: 'img', html: '<img>' }],
    },
    {
      ruleId: 'region',
      impact: 'moderate',
      description: 'Use landmarks',
      helpUrl: 'https://y',
      nodes: [{ selector: 'div', html: '<div>' }],
    },
  ],
};

describe('Report', () => {
  it('shows the severity summary including passes', () => {
    render(<Report model={model} onSelectFinding={() => {}} />);
    expect(screen.getByText(/7 passing/i)).toBeTruthy();
    expect(screen.getByText(/1 critical/i)).toBeTruthy();
  });

  it('lists findings grouped under severity headings', () => {
    render(<Report model={model} onSelectFinding={() => {}} />);
    expect(screen.getByRole('heading', { name: /critical/i })).toBeTruthy();
    expect(screen.getByText('Images need alt')).toBeTruthy();
    expect(screen.getByText('Use landmarks')).toBeTruthy();
  });
});
