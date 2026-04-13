# Manuel Hortelano | UX Engineering Portfolio V2

An enterprise-grade UX Engineering portfolio built to prove production-level frontend architecture, accessibility rigor, and measurable UX outcomes. The repository combines a static-first Astro foundation with selectively hydrated Preact islands, a decoupled MDX-driven design system, and a strict quality pipeline focused on maintainability, ethics, and runtime efficiency.

This codebase documents both engineering quality and case-study impact. It includes validated thesis outcomes (SUS 72, 100% completion on critical work-order execution) and industrial VR training results (94% positive feedback from approximately 100 operators), while preserving a highly optimized delivery model for the web platform itself.

## Architecture & Stack

- **Frontend Architecture:** Astro 6.1.5 with partial hydration via Preact islands (`@astrojs/preact` 5.1.1) for interactive components only.
- **UI System:** Tailwind CSS 4.1 with semantic token documentation in Storybook 8.6 (MDX).
- **Quality & Governance:** TypeScript 5 strict mode (`strictNullChecks`, `noImplicitAny`, `exactOptionalPropertyTypes`) with Biome 2.4.10 enforcing lint and style consistency.
- **Testing:** Vitest 4 + JSDOM + Testing Library (`@testing-library/preact`, `jest-dom`, `user-event`) for interaction and contract validation.

## Core Achievements

- **Lighthouse Quality:** 100/100 in Accessibility, Best Practices, and SEO, with a highly optimized, lightweight runtime Performance profile.
- **Pipeline Reliability:** Zero-defect strict TypeScript and Biome-driven quality workflow documented in the engineering log.
- **Ethical UX & Human Factors:** Zero-dark-pattern consent architecture, ARIA-first interaction semantics, and kinematic positioning aligned with Fitts's Law.
- **Decoupled Design System:** Storybook-based MDX documentation and token architecture developed independently from static Astro page rendering.
- **Case Study Evidence:**
  - **HCID Thesis:** SUS 72 (75th percentile benchmark), grade B, 100% completion of the critical Work Order Execution task, no critical usability errors.
  - **Industrial VR Training:** 94% positive feedback (67% Excellent, 27% Very Good) across approximately 100 operators.

## Agentic AI Workflow

Development followed a dual-agent orchestration model: GitHub Copilot for in-repo dependency mapping and codebase mutation, paired with a high-reasoning "Tech Lead" agent for architecture audits and prompt-level execution strategy. Model routing was intentionally cost-aware, using high-reasoning models for system decisions and lightweight models for bounded implementation tasks.

## Local Development (Getting Started)

```bash
npm install
npm run dev
npm run build-storybook
npm run build
```

## Deployment Strategy

The repository is designed for **decoupled static deployment**:

- **Main Site:** Astro production build deployed as the public portfolio.
- **Design System:** Storybook static build deployed independently (recommended on a dedicated sub-domain).

This split enables independent release cadence, isolates UI documentation artifacts from production routing concerns, and keeps the portfolio runtime lean.
