import type { Meta, StoryObj } from '@storybook/react-vite';
import type { AnnounceableNode } from '../../../core/types';
import { Transcript } from '../Transcript';

const nodes: AnnounceableNode[] = [
  { id: '1', role: 'heading', name: 'Find a doctor', state: {}, level: 1 },
  { id: '2', role: 'textbox', name: 'Search by name or specialty', state: { required: true } },
  { id: '3', role: 'button', name: 'Search', state: {} },
  { id: '4', role: 'link', name: 'Browse by specialty', state: {} },
  { id: '5', role: 'listitem', name: 'Cardiology', state: {}, setInfo: { position: 1, size: 12 } },
  { id: '6', role: 'listitem', name: 'Dermatology', state: {}, setInfo: { position: 2, size: 12 } },
];

const meta: Meta<typeof Transcript> = {
  title: 'Overlay/Transcript',
  component: Transcript,
  args: { nodes },
};

export default meta;
type Story = StoryObj<typeof Transcript>;

export const AtStart: Story = {
  args: { index: 0 },
};

export const MidReading: Story = {
  args: { index: 4 },
};
