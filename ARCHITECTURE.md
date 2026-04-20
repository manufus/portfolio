# 🏛️ Architecture & Engineering Manifesto

This document serves as the Single Source of Truth (SSOT) for the structural, structural, and architectural decisions of this portfolio. It acts as a strict guideline to maintain the project's **100/100 Lighthouse scores**, zero-error TypeScript build, and scalable maintainability.

---

## 1. Core Paradigm: The Islands Architecture
This project leverages **Astro** as the static site generator and HTML renderer, combined with **Preact** for client-side interactivity. 
* **Zero-JS by Default:** No JavaScript is shipped to the client unless strictly necessary.
* **Partial Hydration:** Interactive components (Islands) must be explicitly hydrated using Astro client directives (e.g., `client:load`, `client:visible`).
* **Strict TypeScript:** The repository enforces a 0-Error/0-Warning TypeScript compilation. 

---

## 2. Component Taxonomy (`src/components/`)
To prevent "taxonomy drift" and ambiguous categorization, all UI components must be strictly placed into one of the following directories based on their **responsibility**, not just their visual shape:

* 🧱 **`primitives/`**: Style-system building blocks with zero domain coupling. No collection imports, no route assumptions. (e.g., `Button`, `Logo`, `SeparatorLine`).
* 📦 **`composites/`**: Reusable semantic compositions built exclusively from primitives. No app-global side effects. (e.g., `WorkCard`, `PageHeader`, `AboutExperience`).
* 🧩 **`sections/`**: Page-region assemblies that wire content to composites. These represent full page blocks and are allowed to import collections/data queries. (e.g., `Header`, `Footer`, `FeaturedWork`).
* ⚙️ **`features/`**: Domain or behavior-specific modules with local logic. (e.g., `Toc`, `Pagination`, `ActionBar`).
* 🌍 **`system/`**: App-shell and cross-cutting infrastructure. Global behavior, SEO, and layout-level integrations. (e.g., `Meta.astro`, `Analytics.astro`).
* 🏝️ **`islands/`**: **Preact-only** components that require client-side hydration. Must use Hooks/Browser APIs responsibly. (e.g., `ThemeToggle`, `CookieConsent`).

---

## 3. Data Layer & Single Source of Truth
Content and UI are strictly decoupled. The UI must never hardcode domain data.

* **Projects & Collections (`src/collections/`):** Data is centralized. We maintain a unified `projects.json` file. Featured projects are filtered via the `"featured": true` boolean flag, eliminating duplicate JSON arrays.
* **Site Configuration (`src/config/site.ts`):** This is the strict SSOT for all site metadata, author details, and social links. UI components (like the Footer or Header) must import social data from this typed configuration, not from independent JSONs.
* *Roadmap Note:* The Data Layer is structurally prepared to migrate to Astro Content Collections with strict **Zod** schema validation in future iterations.

---

## 4. SEO & Metadata Infrastructure
To preserve the 100/100 Lighthouse SEO score, metadata logic is centralized:
* **The `Meta` Component:** All `<head>` tag logic (Canonical URLs, Open Graph, Twitter Cards) lives exclusively inside `src/components/system/Meta.astro`.
* **Layout Consumption:** Wrapper layouts (like `Layout.astro`) simply import and render the `Meta` component, passing down the necessary props. Duplicate metadata logic at the layout level is strictly forbidden.

---

## 5. Asset Management Strategy
Assets are split into two distinct workflows to maximize performance:
* 🖼️ **`src/assets/images/`**: Reserved for raster imagery (JPG, PNG) and content photos. These are processed, optimized, and converted to WebP by Astro's built-in image optimization pipeline.
* ✒️ **`src/icons/`**: Reserved for clean, local SVG files. These are ingested by `astro-icon` and injected inline into the HTML. 
  * *Rule:* Monochromatic icons must use `fill="currentColor"` in their source code to ensure native, CSS-driven Dark Mode compatibility via Tailwind's `text-*` utility classes.

---

## 6. Strict TypeScript & Client Scripts
JavaScript (`.js`) files are deprecated in this architecture.
* **Configuration:** All config files (e.g., `site.ts`) must export strongly typed interfaces (`SiteConfig`, `SocialLink`).
* **Client Scripts (`main.ts`):** * **DOM Safety:** All DOM queries (`getElementById`, `querySelector`) must be properly cast (e.g., `HTMLElement`) and guarded with strict null checks.
  * **Window Augmentation:** Custom global functions attached to the `window` object (e.g., mobile menu toggles) must be declared via TypeScript Global Window Augmentation within the script to prevent compilation errors.

---

## 7. Quality Gates & CI/CD Validation
Before any code is merged or deployed, it must pass the following strict quality gates:
1. **Linter & Formatter:** Must pass `Biome`'s ultra-fast, strict checks.
2. **Build Integrity:** `npm run build` must exit with code 0 (Zero TS or path errors).
3. **Design System:** `npm run build-storybook` must bundle successfully. Components must maintain updated metadata titles matching the `src/components/` taxonomy.
4. **Contract Testing:** `Vitest + JSDOM` must validate core business logic and PubSub state.