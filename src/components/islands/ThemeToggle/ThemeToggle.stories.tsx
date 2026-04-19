import type { Meta, StoryObj } from "@storybook/preact";
import { ThemeToggle } from "./ThemeToggle";

const meta: Meta<typeof ThemeToggle> = {
  title: "Islands/ThemeToggle",
  component: ThemeToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  args: {},
};

export const WithCustomClass: Story = {
  args: {
    className: "ring-2 ring-brand/50",
  },
};

export const InHeader: Story = {
  decorators: [
    (Story) => (
      <div class="w-full h-20 bg-surface-canvas border-b border-border-subtle flex items-center justify-end px-6">
        <Story />
      </div>
    ),
  ],
};
