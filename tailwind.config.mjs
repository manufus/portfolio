/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        brand: ["var(--font-brand)"],
        sans: ["var(--font-sans)"],
        body: ["var(--font-body)"],
      },
      maxWidth: {
        screen: "var(--max-screen)",
        inner: "var(--inner-screen)",
      },
      colors: {
        brand: {
          DEFAULT: "var(--color-brand)",
          strong: "var(--color-brand-strong)",
          light: "var(--color-brand-light)",
          on: "var(--color-brand-on)",
        },
        surface: {
          canvas: "var(--color-surface-canvas)",
          subtle: "var(--color-surface-subtle)",
          elevated: "var(--color-surface-elevated)",
          inverse: "var(--color-surface-inverse)",
        },
        content: {
          primary: "var(--color-content-primary)",
          secondary: "var(--color-content-secondary)",
          tertiary: "var(--color-content-tertiary)",
          inverse: "var(--color-content-inverse)",
        },
        border: {
          subtle: "var(--color-border-subtle)",
          strong: "var(--color-border-strong)",
          inverse: "var(--color-border-inverse)",
        },
        action: {
          primary: "var(--color-action-primary)",
          "primary-hover": "var(--color-action-primary-hover)",
          "primary-inverse": "var(--color-action-primary-inverse)",
          "primary-inverse-hover": "var(--color-action-primary-inverse-hover)",
        },
      },
      boxShadow: {
        soft: "0 2px 3px 0 rgba(var(--color-brand-rgb), 0.1)",
        elevated: "0 6px 9px 0 rgba(var(--color-brand-rgb), 0.15)",
        floating: "0 1px 4px 0 rgba(25, 33, 61, 0.06)",
      },
      borderRadius: {
        card: "1rem",
        pill: "9999px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
