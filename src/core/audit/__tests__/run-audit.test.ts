import { describe, it, expect } from 'vitest';
import { toReportModel } from '../run-audit';

const axeResults = {
  passes: [{ id: 'p1' }, { id: 'p2' }],
  violations: [
    {
      id: 'image-alt',
      impact: 'critical',
      description: 'Images must have alternate text',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.10/image-alt',
      nodes: [{ target: ['img.logo'], html: '<img class="logo">' }],
    },
    {
      id: 'color-contrast',
      impact: 'serious',
      description: 'Elements must have sufficient contrast',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.10/color-contrast',
      nodes: [{ target: ['p'], html: '<p>low</p>' }],
    },
    {
      id: 'region',
      impact: 'moderate',
      description: 'All content should be in landmarks',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.10/region',
      nodes: [{ target: ['div'], html: '<div></div>' }],
    },
  ],
} as any;

describe('toReportModel', () => {
  it('counts passes and violations by severity', () => {
    const report = toReportModel(axeResults);
    expect(report.summary).toEqual({
      critical: 1,
      serious: 1,
      moderate: 1,
      minor: 0,
      passes: 2,
    });
  });

  it('orders findings critical → serious → moderate → minor', () => {
    const report = toReportModel(axeResults);
    expect(report.findings.map((f) => f.impact)).toEqual(['critical', 'serious', 'moderate']);
  });

  it('flattens node target arrays into selector strings', () => {
    const report = toReportModel(axeResults);
    expect(report.findings[0]!.nodes[0]!).toEqual({
      selector: 'img.logo',
      html: '<img class="logo">',
    });
  });
});
