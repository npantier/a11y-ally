import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  args: {
    label: 'Speed',
    min: 0.5,
    max: 2,
    step: 0.1,
    value: 1,
  },
  // Slider is controlled — back it with the story's own args so dragging the thumb and
  // editing the Controls panel stay in sync (plain useState wouldn't react to controls).
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();
    return <Slider {...args} value={value} onChange={(next) => updateArgs({ value: next })} />;
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {};

export const MaxSpeed: Story = {
  args: { value: 2 },
};
