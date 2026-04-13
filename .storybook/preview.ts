import type { Preview } from "@storybook/preact-vite";
import "../src/styles/global.css"; // CRÍTICO: Carga Tailwind y tus Tokens

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			test: "todo",
		},
	},
	globalTypes: {
		theme: {
			name: "Theme",
			description: "Global theme for stories",
			defaultValue: "light",
			toolbar: {
				icon: "circlehollow",
				items: [
					{ value: "light", title: "Light Mode" },
					{ value: "dark", title: "Dark Mode" },
				],
				dynamicTitle: true,
			},
		},
	},
	decorators: [
		(Story, context) => {
			// Este decorador inyecta la clase 'dark' para que Tailwind reaccione
			const isDark = context.globals.theme === "dark";
			document.documentElement.classList.toggle("dark", isDark);
			return Story();
		},
	],
};

export default preview;
