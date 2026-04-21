import type { StorybookConfig } from "@storybook/preact-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: ["@storybook/addon-essentials", "@storybook/addon-a11y"],
	framework: {
		name: "@storybook/preact-vite",
		options: {},
	},
	core: {
    disableTelemetry: true,
  },
	viteFinal: async (config) => {
		config.plugins = config.plugins || [];
		config.plugins.push(tailwindcss());
		return config;
	},
};
export default config;
