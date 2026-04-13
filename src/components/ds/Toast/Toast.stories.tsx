import type { Meta, StoryObj } from "@storybook/preact";
import { useState } from "preact/hooks";
import Toast, { type ToastItem } from "./Toast";

const meta: Meta<typeof Toast> = {
  title: "DS/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

function ToastHarness({ initial }: { initial: ToastItem[] }) {
  const [items, setItems] = useState<ToastItem[]>(initial);
  return (
    <div class="min-h-screen bg-surface-canvas">
      <Toast
        items={items}
        onDismiss={(id) => setItems((prev) => prev.filter((item) => item.id !== id))}
      />
    </div>
  );
}

export const Info: Story = {
  render: () => (
    <ToastHarness
      initial={[
        {
          id: "info-1",
          title: "Heads up",
          message: "Your preference was updated.",
          variant: "info",
        },
      ]}
    />
  ),
};

export const Success: Story = {
  render: () => (
    <ToastHarness
      initial={[
        {
          id: "success-1",
          title: "Saved",
          message: "Settings synced successfully.",
          variant: "success",
        },
      ]}
    />
  ),
};

export const ErrorState: Story = {
  render: () => (
    <ToastHarness
      initial={[
        {
          id: "error-1",
          title: "Upload failed",
          message: "Please retry in a few seconds.",
          variant: "error",
          durationMs: 6000,
        },
      ]}
    />
  ),
};
