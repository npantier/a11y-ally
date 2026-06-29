import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from '../IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  args: {
    label: 'Play',
    children: '▶',
    onClick: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Play: Story = {};

export const Pause: Story = {
  args: { label: 'Pause', children: '⏸' },
};

export const Previous: Story = {
  args: { label: 'Previous', children: '⏮' },
};
