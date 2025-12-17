# Life Suggestion — Constitution
<!-- Sync Impact Report
Version change: 0.0.0 -> 1.0.0
Modified principles: (new) Privacy & No-Collection; Deterministic Date-Locked Delivery; Frontend-Only Static Deployment; Simplicity, Accessibility & UX; Maintainability, Testing & Versioning
Added sections: Constraints & Standards; Development Workflow
Removed sections: placeholder tokens replaced
Templates requiring updates: .specify/templates/plan-template.md ⚠ pending review
						 .specify/templates/spec-template.md ⚠ pending review
						 .specify/templates/tasks-template.md ⚠ pending review
Follow-up TODOs: none required; all placeholders filled
-->

## Core Principles

### Privacy & No-Collection (NON-NEGOTIABLE)
All builds and releases MUST collect no personal user data. The application MUST NOT include analytics, tracking, authentication, or any server-side or client-side mechanism that stores or transmits identifiable user information. Telemetry limited to anonymous, opt-in diagnostics for maintainers is allowed only if documented and reversible.

Rationale: Target audience is sensitive; protecting privacy is the highest priority and simplifies frontend-only deployment.

### Deterministic Date-Locked Delivery (NON-NEGOTIABLE)
The daily message selection logic MUST be purely deterministic and based on the local device date and a project `startDate`. Users MUST NOT be able to skip, reorder, or manually select future or past messages. Local device time zone and local date MUST be used to decide which message is shown for that calendar day.

Rationale: Guarantees the intended ritual experience and prevents accidental or intentional message replay.

### Frontend-Only Static Deployment (Vercel-ready)
The project MUST be implementable as a static, frontend-only site suitable for Vercel static hosting: static assets, prebuilt JSON or static array of 365 messages, no server-side runtime required, no secrets in the repo, and no serverless functions that handle user data. Build artifacts should support edge/CDN caching and incremental static regeneration is OPTIONAL but not required.

Rationale: Simplifies operations, reduces attack surface, and aligns with the user's deployment target (Vercel).

### Simplicity, Accessibility & UX
Design and implementation MUST prioritize calm, accessible, and lightweight experiences: mobile-first, WCAG AA accessibility for text contrast and readable font sizes, reduced-motion preference respected, gentle transitions, and minimal UI controls. Visual style is soft, warm, and emotionally safe.

Rationale: The app's value comes from emotional tone and predictability — the UI must not distract or cause cognitive load.

### Maintainability, Testing & Versioning
Code MUST follow modern best practices: component-driven architecture (Nuxt 3 + Vue 3 Composition API), clear separation of concerns, and automated linting/formatting. Tests SHOULD include unit tests for date-selection logic and a small set of UI snapshot or integration tests. Repository MUST follow semantic versioning for releases and simple branching (feature → main) with PR reviews.

Rationale: Keeps the project robust, easy to review, and safe to deploy to Vercel and similar static hosts.

## Constraints & Standards

- **Technology stack (recommended)**: Nuxt.js (Nuxt 3) with Vue 3 (Composition API); Vuetify for UI components; optional TypeScript (recommended but not mandatory). The app MUST build to a static site that Vercel can host.
- **Data storage**: 365 messages stored locally in a static JSON file or as a compiled array in the frontend bundle. No server or database present.
- **Start date**: Default `startDate` SHOULD be 2025-12-18 (as noted in project draft). Implementations MUST allow this to be changed at build time but MUST NOT allow runtime manipulation by end users.
- **Message rules**: Exactly one message per day; 365 unique messages; no repeats within a 365-day cycle; message availability unlocks at local 06:00 AM where that is the local device time for the current calendar date.
- **Privacy & secrets**: No secrets or credentials in source. Build-time environment variables (if used) MUST not contain user-identifying info and MUST be documented.
- **Accessibility**: Follow WCAG AA: keyboard navigable, semantic HTML, sufficient contrast, and respect `prefers-reduced-motion`.
- **Performance**: Keep initial JS bundle small; prefer code-splitting for non-critical assets; images optimized for web and served responsively.

## Development Workflow

- **Branching**: Use short-lived feature branches named `feat/<short-description>` or `fix/<short-description>`. Merge to `main` via PR after review.
- **Reviews & approvals**: All PRs that change UI/UX or core logic MUST be reviewed by at least one maintainer. Major changes to delivery logic (date selection, startDate) MUST have two approvals.
- **Linting & formatting**: Use ESLint and Prettier (or equivalent). Commits SHOULD run formatting checks locally (pre-commit hook recommended).
- **Testing**: Unit tests for the date-selection logic and message indexing are REQUIRED. UI tests are RECOMMENDED for critical flows. CI SHOULD run tests and linters on PRs.
- **Deployment**: Merge to `main` triggers Vercel automatic deployment. Previews are generated for PRs using Vercel preview environments.
- **Release & versioning**: Releases follow semantic versioning. Tag releases in Git and include a short changelog entry.
- **Code style**: Follow widely adopted best practices: clear naming, avoid single-letter variables, prefer explicit types when using TypeScript, and keep components small and focused.

## Governance

Amendments to this constitution are made by submitting a pull request that modifies this file. Amendment PRs MUST include:

- A summary of the change and the rationale.
- The semantic version bump proposed (MAJOR | MINOR | PATCH) with justification.
- Tests or checks that demonstrate compliance with any new rule.

Approval rules:

- **Patch (PATCH)**: Minor wording or clarifications; requires one maintainer approval.
- **Minor (MINOR)**: New principle or non-breaking guidance (adds requirements); requires two maintainer approvals and a migration note.
- **Major (MAJOR)**: Removing or redefining existing principles in a way that is potentially breaking to existing workflows; requires majority approval from the core maintainers and a published migration plan.

Compliance & review:

- All PRs that implement or change functionality MUST reference the constitution section they are satisfying.
- The repository owner(s) are responsible for ensuring the constitution reflects operational reality.

**Version**: 1.0.0 | **Ratified**: 2025-12-17 | **Last Amended**: 2025-12-17
