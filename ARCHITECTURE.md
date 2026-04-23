# Architecture & Engineering Rules

This file documents architecture rules for this repo. Keep it aligned with code. If rules and code diverge, update one immediately.

---

## 1. Core Paradigm: Astro + Islands
This project uses Astro for static HTML and Preact for interactive client components.
* **Vanilla JS vs. Islands:** Use Astro `<script>` tags (Vanilla JS) for simple DOM mutations (e.g., scroll observers, ToTop buttons, Toc). Use Preact Islands (`client:load`, `client:visible`) exclusively for complex state management and interactive features.
* **Strict TypeScript:** The repository enforces a 0-Error/0-Warning TypeScript compilation.

---

## 2. Component Taxonomy (`src/components/`)
Place components by responsibility. Use the folder rules below:

* 🧱 **`primitives/`**: Style-system building blocks with zero domain coupling. No collection imports, no route assumptions. (e.g., `Button`, `Logo`*, `SeparatorLine`).
* 📦 **`composites/`**: Reusable semantic compositions built exclusively from primitives. No app-global side effects. (e.g., `WorkCard`, `PageHeader`, `AboutExperience`).
* 🧩 **`sections/`**: Page-region assemblies that wire content to composites. These represent full page blocks and are allowed to import collections/data queries. (e.g., `Header`, `Footer`, `FeaturedWork`).
* ⚙️ **`features/`**: Domain or behavior-specific modules with local logic. (e.g., `Toc`, `Pagination`, `ActionBar`).
* 🌍 **`system/`**: App-shell and cross-cutting infrastructure. Global behavior, SEO, and layout-level integrations. (e.g., `Meta.astro`, `Analytics.astro`).
* 🏝️ **`islands/`**: **Preact-only** components that require client-side hydration. Must use Hooks/Browser APIs responsibly. (e.g., `ThemeToggle`, `CookieConsent`).

---

## 3. Data Layer & Single Source of Truth
Content and UI are strictly decoupled. The UI must never hardcode domain data.

* **Projects & Collections (`src/collections/`):** Data is centralized in `projects.json`. Featured projects are filtered via the `"featured": true` boolean flag.
* **Site Configuration (`src/config/site.ts`):** This is the strict SSOT for all site metadata, author details, and social links. UI components must import social data from this typed configuration.
* *Roadmap Note:* Planned: migrate collections to Astro Content Collections with Zod schemas.

---

## 4. SEO & Metadata Infrastructure
* **The `Meta` Component:** SEO metadata is centralized in `src/components/system/Meta.astro`.
* **Layout Consumption:** Wrapper layouts simply import and render the `Meta` component. Duplicate metadata logic at the layout level is strictly forbidden.

---

## 5. Asset Management Strategy
Use `src/assets` for optimized raster assets and `src/icons` for local SVG assets.
* 🖼️ **`src/assets/`**: Reserved for raster imagery (JPG, PNG, WebP). Organized by domain folders (e.g., `projects/`, `home/`).
* ✒️ **`src/icons/`**: Reserved for clean, local SVG files ingested by `astro-icon`. Monochrome icons delegate color control to `astro-icon` and Tailwind CSS `text-*` classes.

---

## 6. Strict TypeScript & Client Scripts
JavaScript (`.js`) files are deprecated in this architecture.
* **Configuration:** All config files must export strongly typed interfaces (`SiteConfig`, `SocialLink`).
* **Client Scripts (`main.ts`):** All DOM queries must be properly cast (e.g., `HTMLElement`) and guarded with strict null checks (or optional chaining). Custom global functions attached to `window` must be declared via TypeScript Global Window Augmentation.

---

## 7. Quality Gates & CI/CD Validation
Before any code is merged, it must pass these strict quality gates:
1. **Linter & Formatter:** Biome checks must pass in CI (`npx biome check .`).
2. **Build Integrity:** `npm run build` must exit with code 0.
3. **Design System:** `npm run build-storybook` must bundle successfully.
4. **Contract Testing:** `Vitest + JSDOM` must validate core component logic.

---

## 8. State Management & Event-Driven Architecture (PubSub)
To maintain a lightweight footprint and avoid React-ecosystem bloat, **external state management libraries (e.g., Redux, Zustand, NanoStores) are strictly forbidden.**

Cross-component communication, especially across the Static-to-Reactive boundary (e.g., an Astro Footer triggering a Preact Island), must be handled via a **Native Browser PubSub Architecture**:
* **The Event Bus:** Use the global `window` object to dispatch and listen to standard `CustomEvent` APIs.
* **Event Naming Convention:** Use domain-prefixed, colon-separated strings (e.g., `cookie-consent:reset`, `ds:toast`).
* **Payloads:** Pass state data cleanly through the event's `detail` property.
* **Hygiene:** All Preact islands must rigorously clean up their event listeners (`window.removeEventListener`) within the `useEffect` cleanup return function to prevent memory leaks.