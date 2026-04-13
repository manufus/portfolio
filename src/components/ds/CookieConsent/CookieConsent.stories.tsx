import type { Meta, StoryObj } from "@storybook/preact";
import CookieConsent from "./CookieConsent";

const meta: Meta<typeof CookieConsent> = {
  title: "DS/CookieConsent",
  component: CookieConsent,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    storageKey: "storybook.cookie-consent",
  },
};

export default meta;
type Story = StoryObj<typeof CookieConsent>;

export const Default: Story = {
  render: (args: typeof CookieConsent) => (
    <div class="min-h-screen bg-surface-canvas p-6">
      <CookieConsent {...args} />
    </div>
  ),
};

export const DarkMode: Story = {
  globals: {
    theme: "dark",
  },
  render: (args: typeof CookieConsent) => (
    <div class="min-h-screen bg-surface-canvas p-6">
      <CookieConsent {...args} />
    </div>
  ),
};
