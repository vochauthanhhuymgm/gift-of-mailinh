# Research: Daily Life-Healing Suggestions (365-Day Journey)

**Phase**: 0 (Research & Clarification)  
**Date**: 2025-12-17  
**Status**: Complete

## Overview

All technical and design unknowns have been resolved through specification and clarification sessions. This document records the decisions and rationale for each key technology and design choice.

---

## 1. Frontend Framework Choice: Nuxt.js 3 + Vue 3

### Decision
**Nuxt.js 3** with **Vue 3 Composition API** for component structure, routing, and static site generation.

### Rationale
- **Static Generation**: Nuxt 3 supports `nuxi generate` → produces static HTML/CSS/JS artifacts suitable for Vercel without a Node.js runtime.
- **Vue 3 Composition API**: Modern, composable approach to component logic; better for date-calculation and state management than Options API.
- **Routing**: Nuxt File-based routing simplifies coming-soon and completion states (separate pages).
- **Ecosystem**: Large ecosystem, excellent testing support (Vitest, Nuxi test utils), and strong accessibility guidance.
- **Alternatives Considered**:
  - SvelteKit: Excellent static generation but smaller ecosystem for this use case.
  - Next.js: Requires Node.js runtime on Vercel (not static-only); overkill for a single-page experience.
  - Plain Vue 3 + Vite: Possible but missing routing, build conventions, and static generation helpers.

---

## 2. UI Component Library: Vuetify 3

### Decision
**Vuetify 3** (Vue 3-compatible Material Design component library).

### Rationale
- **Accessibility Built-in**: Vuetify components follow Material Design accessibility guidelines; reduces work to achieve WCAG AA.
- **Theming**: Easy to customize colors, typography, and motion preferences (respects `prefers-reduced-motion` out of the box).
- **Component Coverage**: Rich set of calm, composable components (card, typography, icons, layouts).
- **Vercel Compatibility**: Fully compatible with static generation.
- **Alternatives Considered**:
  - Headless UI / Radix UI: Minimal, lightweight but requires more custom styling for calm aesthetic.
  - Bootstrap Vue: Heavier, less modern than Vuetify; Material Design aligns better with calm aesthetic.
  - Custom components: Too much work to ensure accessibility and performance.

---

## 3. Testing Strategy

### Decision
- **Unit Tests**: Vitest (Jest-compatible) for date logic (`useMessageIndex`, `useDateLock`) and message service.
- **Integration Tests**: Playwright for date-driven message selection, 6:00 AM transitions, and edge state rendering.
- **E2E Tests**: Playwright for full user journeys (open app, see message; edge cases; accessibility audit).

### Rationale
- **Vitest**: Fast, minimal setup, works seamlessly with Nuxt and Vite.
- **Playwright**: Industry-standard for browser automation; supports multiple browsers and accessibility testing (WCAG AA validation).
- **Date Logic Focus**: Most critical to test is the date-to-message mapping (FR-001, FR-003); edge cases (before startDate, day 365+, timezone).
- **Accessibility Testing**: Playwright can check contrast, keyboard navigation, and screen reader compatibility.

---

## 4. Message Storage: Static JSON

### Decision
**Single `messages.json` file** bundled with the frontend at build time. 365 messages stored as an array or object keyed by index (0–364).

### Rationale
- **No Backend Required**: JSON is static; no API, no database, no server-side logic needed.
- **Fast Load**: JSON is tiny (~50–100 KB uncompressed for 365 moderate-length messages); bundled and cached by Vercel's CDN.
- **Easy Maintenance**: Non-technical contributors can edit JSON to update messages or tweak metadata (author, theme, etc.).
- **Privacy**: All messages bundled locally; no external API calls, no data transmission.
- **Alternatives Considered**:
  - Hardcoded JavaScript array: Less maintainable; harder to edit without code knowledge.
  - Markdown files + build-time parsing: Extra build complexity; JSON is simpler.
  - CSV + convert to JSON: Possible but JSON is already clear and human-editable.

---

## 5. Date Calculation & Timezone Handling

### Decision
- Use **device local date** (not UTC) to determine which message to show.
- **6:00 AM local time** is the unlock time (not a server-based time check).
- **Trust the device clock**: No active prevention of clock manipulation; localStorage-based tracking for awareness only (Clarification Q3).

### Rationale
- **Local Time**: Each user's timezone is respected; 6:00 AM for a user in Tokyo is different from 6:00 AM in New York.
- **Device Clock**: Aligns with the privacy principle (no server-side time validation) and simplifies architecture.
- **Trust Model**: Accepting minor clock manipulation keeps the system simple and frontend-only. Most users won't cheat; for those who do, the consequence is minor (accessing tomorrow's message a few hours early).
- **localStorage Tracking**: Can log "last seen date" to detect large jumps and warn users, but not enforce.
- **Calculation Formula**: `dayIndex = Math.floor((Date.now() - startDate) / 86400000)`

---

## 6. Before-startDate Behavior

### Decision
**"Coming Soon" screen**: Display a placeholder (e.g., "Your 365-day journey begins on [startDate]. Get ready at 6:00 AM!") with no message preview.

### Rationale
- **Respects Date-Lock Principle**: Prevents users from peeking at future content.
- **Builds Anticipation**: The "coming soon" framing builds emotional investment in the ritual.
- **Clarity**: Users understand that content is not yet available and when it will be.
- **Alternative (Rejected)**: Preview first message → Breaks the "strictly by date" constraint.

---

## 7. Day 365+ Completion Behavior

### Decision
**Completion Screen**: After day 365, the app displays a completion message and stops showing new messages (no recycling to day 1).

### Rationale
- **Honors the Journey**: A "365-day journey" implies a beginning and end; cycling back would reframe it as unlimited.
- **Emotional Closure**: A completion screen provides closure and celebration, fitting the emotional support goal.
- **Future Extensibility**: If desired, a future version could offer a new 365-day cycle or extended content.
- **Alternative (Rejected)**: Cycle to day 1 → Users might revisit the same messages unintentionally, diminishing impact.

---

## 8. Accessibility & "prefers-reduced-motion"

### Decision
- **WCAG AA Compliance**: Text contrast ≥4.5:1; semantic HTML; keyboard navigable.
- **Reduced Motion**: Respect `prefers-reduced-motion: reduce` in all animations (fade-ins, transitions); remove or reduce to <100ms.
- **Typography**: Large, readable font sizes (18px+ for body text); clear line-height (1.5+).

### Rationale
- **Inclusivity**: Female students may include those with vestibular disorders, ADHD, or other conditions affecting motion sensitivity.
- **Vuetify Support**: Vuetify respects `prefers-reduced-motion` out of the box; custom animations must be checked.
- **Testing**: Include Playwright tests with `prefers-reduced-motion` enabled to ensure compliance.

---

## 9. Offline Capability

### Decision
**Offline-capable by default**: All messages and assets bundled at build time; app works fully offline after first load.

### Rationale
- **User Accessibility**: Users may not always have reliable internet (e.g., limited data plans).
- **Privacy Benefit**: No external requests needed; all content local.
- **Service Worker**: Optional; Nuxt can generate a basic service worker for caching. Not required but beneficial.

---

## 10. Deployment: Vercel Static Hosting

### Decision
- **Build Command**: `nuxi generate` → produces static artifact (`dist/` folder).
- **Vercel Config**: `vercel.json` specifies static routes, caching headers, and redirect rules (coming-soon, completed).
- **No Serverless Functions**: All functionality in static HTML/JS/CSS.
- **Preview Environments**: Vercel automatically generates preview deploys for PRs (aid for review).

### Rationale
- **Zero Ops**: Static hosting requires no server maintenance, scaling, or runtime complexity.
- **Security**: No backend means no attack surface for authentication, data breaches, or injection attacks.
- **Cost**: Static hosting is typically free or very cheap on Vercel.
- **Speed**: Static assets cached globally on CDN; instant load from edge.

---

## 11. Code Quality & Development Workflow

### Decision
- **Linting**: ESLint with Nuxt/Vue plugins to catch errors and enforce consistent style.
- **Formatting**: Prettier to auto-format code on save (pre-commit hook recommended).
- **Pre-commit Hooks**: Use `husky` + `lint-staged` to run linting and formatting before commits.
- **PR Reviews**: All PRs reviewed by at least one maintainer; major changes (date logic, startDate) require two approvals.
- **Versioning**: Semantic versioning (MAJOR.MINOR.PATCH) for releases; tag releases in Git.

### Rationale
- **Maintainability**: Linting and formatting keep code readable and reduce churn in diffs.
- **Reliability**: Tests + linting catch bugs early.
- **Team Collaboration**: Clear standards make it easier for multiple contributors.

---

## 12. Privacy & Data Collection

### Decision
**Zero data collection**: No analytics, no tracking, no user identification, no telemetry.

### Rationale
- **Constitution Principle**: Privacy & No-Collection is NON-NEGOTIABLE.
- **Target Audience**: Female students are a sensitive demographic; trust is essential.
- **Simplicity**: No analytics infrastructure needed; reduces complexity and cost.
- **Legal**: Avoids GDPR, CCPA, and other privacy regulations.
- **Build-time Env Vars**: If needed (e.g., startDate), they must not contain user-identifying information and must be documented in `.env.example`.

---

## Summary of Unresolved → Resolved Items

| Item | Phase | Resolution |
|------|-------|-----------|
| Day 365+ behavior | Clarification Q1 | Completion Screen (no recycling) |
| Before-startDate screen | Clarification Q2 | "Coming Soon" (no preview) |
| Clock-forward prevention | Clarification Q3 | Trust users (no active prevention) |
| Frontend framework | Research | Nuxt.js 3 + Vue 3 Composition API |
| UI library | Research | Vuetify 3 |
| Testing approach | Research | Vitest (unit), Playwright (integration/e2e) |
| Message storage | Research | Static JSON bundled at build time |
| Date calculation | Research | Local device date; 6:00 AM local time; no NTP validation |
| Accessibility | Research | WCAG AA; respect `prefers-reduced-motion` |
| Deployment | Research | Vercel static hosting; no serverless functions |
| Data collection | Research | Zero (privacy-first) |

---

## Next Steps

**Phase 1** (Design) will generate:
- `data-model.md`: Message entity, Configuration entity, state transitions
- `contracts/openapi.yaml`: Static data endpoint contracts (if any helper APIs are needed)
- `quickstart.md`: Developer onboarding and setup instructions
- Update agent context for Copilot with specific tech stack details

