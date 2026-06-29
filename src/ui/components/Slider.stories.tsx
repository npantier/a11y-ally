import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
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
  // Slider is controlled — wire local state so the thumb actually moves in the workbench.
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <Slider {...args} value={value} onChange={setValue} />;
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {};

export const MaxSpeed: Story = {
  args: { value: 2 },
};
