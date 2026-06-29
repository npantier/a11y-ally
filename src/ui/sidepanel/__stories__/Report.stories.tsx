import type { Meta, StoryObj } from '@storybook/react-vite';
import { Report } from '../Report';
import type { ReportModel } from '../../../core/audit/types';

const populated: ReportModel = {
  summary: { critical: 1, serious: 2, moderate: 1, minor: 0, passes: 12 },
  findings: [
    {
      ruleId: 'image-alt',
      impact: 'critical',
      description: 'Images must have alternate text',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.10/image-alt',
      nodes: [{ selector: 'img.logo', html: '<img class="logo">' }],
    },
    {
      ruleId: 'color-contrast',
      impact: 'serious',
      description: 'Elements must meet minimum color contrast thresholds',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.10/color-contrast',
      nodes: [
        { selector: '.btn-primary', html: '<button class="btn-primary">' },
        { selector: 'a.muted', html: '<a class="muted">Learn more</a>' },
      ],
    },
    {
      ruleId: 'label',
      impact: 'serious',
      description: 'Form elements must have labels',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.10/label',
      nodes: [{ selector: 'input#search', html: '<input id="search">' }],
    },
    {
      ruleId: 'region',
      impact: 'moderate',
      description: 'All page content should be contained by landmarks',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.10/region',
      nodes: [{ selector: 'div.content', html: '<div class="content">' }],
    },
  ],
};

const meta: Meta<typeof Report> = {
  title: 'Sidepanel/Report',
  component: Report,
  args: {
    onSelectFinding: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof Report>;

export const WithFindings: Story = {
  args: { model: populated },
};

export const AllClear: Story = {
  args: {
    model: {
      summary: { critical: 0, serious: 0, moderate: 0, minor: 0, passes: 24 },
      findings: [],
    },
  },
};
