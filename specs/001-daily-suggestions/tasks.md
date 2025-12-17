# Tasks: Daily Life-Healing Suggestions (365-Day Journey)

**Feature Branch**: `001-daily-suggestions`  
**Date Generated**: 2025-12-17  
**Status**: Ready for Implementation  
**Input**: spec.md (3 user stories, 10 FR, 8 SC), plan.md (technical context), research.md (12 decisions), data-model.md (entities, state machine), contracts/openapi.yaml (service interfaces), quickstart.md (developer guide)

---

## Task Organization

**Total Tasks**: 47  
**Phases**: 5 (Setup → Foundational → User Story 1 → User Story 2 → User Story 3 → Polish)  
**Parallelizable Tasks**: 18 marked [P]  
**User Story-Specific**: 34 marked [US1], [US2], [US3]

### Format

```
- [ ] [TaskID] [P?] [Story?] Description with file path
```

- **Checkbox**: Always `- [ ]` (markdown checkbox)
- **Task ID**: Sequential (T001, T002, ..., T047)
- **[P]**: Parallelizable (different files, no inter-task dependencies)
- **[Story]**: [US1], [US2], [US3] for user story tasks (Setup/Foundational phases omit story label)
- **Description**: Clear action with exact file path

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Create project structure and install dependencies

- [ ] T001 Initialize Nuxt 3 project with `npm init nuxi` in `d:\life-sugesstion-proj`
- [ ] T002 Install dependencies: Nuxt 3, Vue 3, Vuetify 3, Vitest, Playwright, ESLint, Prettier via `npm install`
- [ ] T003 [P] Create `.eslintrc.cjs` for code quality rules in repository root
- [ ] T004 [P] Create `.prettierrc.json` for code formatting in repository root
- [ ] T005 [P] Create `nuxt.config.ts` for Nuxt 3 configuration in repository root
- [ ] T006 Create `.env.example` template with VITE_START_DATE, VITE_APP_NAME, VITE_UNLOCKED_HOUR, VITE_UNLOCKED_MINUTE in repository root
- [ ] T007 Create `.gitignore` with node_modules, .nuxt, dist, .env.local in repository root
- [ ] T008 Create directory structure: `src/pages`, `src/components`, `src/composables`, `src/services`, `src/assets`, `public`, `tests`

**Checkpoint**: Project structure ready; dependencies installed; can run `npm run dev`

---

## Phase 2: Foundational (Core Infrastructure)

**Purpose**: Build reusable infrastructure that all user stories depend on

**⚠️ CRITICAL**: All tasks in this phase must complete before ANY user story implementation begins

- [ ] T009 Create `src/composables/useDateLock.ts` with getCurrentDayIndex(), isMessageUnlocked(), getStartDate(), hasJourneyStarted(), hasJourneyCompleted() per contracts/openapi.yaml
- [ ] T010 [P] Create `src/services/messageService.ts` with loadMessages(), getMessageByIndex(), getMessageCount(), validateMessages() per contracts/openapi.yaml
- [ ] T011 [P] Create `src/composables/useMessageIndex.ts` composable returning currentMessage, state, dayIndex, refresh per contracts/openapi.yaml
- [ ] T012 [P] Create `src/assets/messages.json` with 365 message objects (id 0-364, content, author, theme, createdAt) per data-model.md entity schema
- [ ] T013 [P] Create `src/config.ts` with appName, unlockedHour, unlockedMinute, messageMinLength, messageMaxLength per data-model.md Configuration entity
- [ ] T014 Create `src/utils/dateCalculation.ts` with dayIndex calculation formula `Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24))` per data-model.md line 208
- [ ] T015 [P] Create `.env.local` with VITE_START_DATE=2025-12-18, VITE_APP_NAME="Daily Life Suggestions", VITE_UNLOCKED_HOUR=6, VITE_UNLOCKED_MINUTE=0
- [ ] T016 Create validation function `src/utils/validateMessages.ts` ensuring all 365 messages present, content non-empty, id in range [0,364], theme in predefined list per data-model.md validation rules
- [ ] T017 Create `src/types/index.ts` with TypeScript interfaces for Message, Configuration, AppState per contracts/openapi.yaml types
- [ ] T018 [P] Create `src/stores/appState.ts` (if using Pinia) or reactive ref pattern to hold currentMessage, dayIndex, state (COMING_SOON|UNLOCKED|COMPLETED) per data-model.md state machine
- [ ] T019 Create global CSS file `src/assets/styles/global.css` with WCAG AA accessible base styles, soft color palette (per User Story P2 calm aesthetic), typography rules per spec.md FR-005/007

**Checkpoint**: Foundation ready — useMessageIndex, useDateLock, messageService all functional; messages.json loaded; date calculation working; state management ready

---

## Phase 3: User Story 1 — View Today's Daily Suggestion (Priority: P1) 🎯 MVP

**Goal**: Deliver the core daily message display experience that users see every morning at 6:00 AM with date-locked message delivery

**Independent Test**: Can verify independently by:
1. Setting app to display correct message for current day (index = `floor((today - startDate) / 86400000)`)
2. Confirming message doesn't change before 6:00 AM
3. Confirming message changes automatically after 6:00 AM without page refresh

### Tests for User Story 1 (OPTIONAL - included per spec requirement)

- [ ] T020 [P] [US1] Create unit test `tests/unit/useDateLock.test.ts` for getCurrentDayIndex() with fixtures: before startDate (expect -1), day 0 at 6:00 AM (expect 0), day 100 (expect 100), day 365+ (expect ≥365) per spec.md acceptance scenario
- [ ] T021 [P] [US1] Create unit test `tests/unit/messageService.test.ts` for loadMessages(), getMessageByIndex(0-364), validateMessages() ensuring 365 messages load and out-of-bounds returns undefined per spec.md FR-002
- [ ] T022 [P] [US1] Create integration test `tests/integration/dailyMessageFlow.test.ts` simulating time progression from day 0 to day 1, verifying message index increments correctly at 6:00 AM per spec.md acceptance scenario 4
- [ ] T023 [P] [US1] Create Playwright E2E test `tests/e2e/userJourney.spec.ts` for User Story 1: open app, verify message displays above fold, verify no page refresh occurs at 6:00 AM transition per spec.md SC-001/002

### Implementation for User Story 1

- [ ] T024 [P] [US1] Create `src/pages/index.vue` (home page) with <template> displaying currentMessage.content, <script> using useMessageIndex composable, <style> scoped minimal layout per spec.md FR-004 (no message selection controls)
- [ ] T025 [US1] Implement automatic message refresh logic in `src/composables/useMessageIndex.ts` setting timer to refresh message at next 6:00 AM transition per spec.md acceptance scenario 4
- [ ] T026 [P] [US1] Create `src/components/MessageDisplay.vue` component rendering message with emotional tone, respecting prefers-reduced-motion per spec.md FR-006 (optional <500ms animations if reduced-motion disabled)
- [ ] T027 [P] [US1] Create `src/composables/useAnimation.ts` composable for fade-in/slide animations with duration ≥500ms per spec.md SC-005 (gentle, unhurried perception)
- [ ] T028 [US1] Update `src/pages/index.vue` to use MessageDisplay component and useAnimation for message reveal per spec.md FR-005 (calm, minimal context)
- [ ] T029 [P] [US1] Create responsive layout in `src/layouts/default.vue` with mobile-first design, message centered, minimal chrome per spec.md FR-005 and quickstart.md guide
- [ ] T030 [P] [US1] Implement accessibility in MessageDisplay: semantic HTML (<main>, <article>), keyboard navigation, aria-live region if message updates via JS per spec.md FR-007 WCAG AA
- [ ] T031 [US1] Add unit test for useAnimation composable in `tests/unit/useAnimation.test.ts` verifying animation duration ≥500ms unless reduced-motion enabled per spec.md SC-005
- [ ] T032 [US1] Create E2E test variant in `tests/e2e/userJourney.spec.ts` simulating time travel (before startDate, day 0, day 100, day 365+) and verifying correct message displays per data-model.md edge cases

**Checkpoint**: User Story 1 complete — app displays correct daily message, automatically updates at 6:00 AM, respects reduced-motion, passes accessibility tests, MVP deliverable

---

## Phase 4: User Story 2 — Experience Calm, Warm, Emotionally Safe UI (Priority: P2)

**Goal**: Design and implement the visual aesthetic and interaction patterns that make the app feel peaceful, emotionally safe, and aligned with healing/support emotional tone

**Independent Test**: Can verify independently by:
1. Visual inspection: soft color palette, readable fonts, minimal UI clutter
2. Automation: verify contrast ≥4.5:1 (WCAG AA), animations ≥500ms
3. User feedback: 5+ female student testers rate emotional tone ≥4/5 on 5-point scale per spec.md SC-006

### Tests for User Story 2 (OPTIONAL - included per spec requirement)

- [ ] T033 [P] [US2] Create accessibility audit test `tests/axe/a11y.spec.ts` using Playwright + axe-core validating contrast ≥4.5:1, semantic HTML, keyboard navigation per spec.md FR-007/SC-004
- [ ] T034 [P] [US2] Create visual regression test `tests/visual/ui-snapshots.spec.ts` with Playwright visual comparisons for message display, ensuring consistent calm aesthetic across devices per spec.md SC-006
- [ ] T035 [P] [US2] Create reduced-motion test `tests/unit/prefers-reduced-motion.test.ts` verifying animations removed/minimal (<100ms) when `prefers-reduced-motion: reduce` media query active per spec.md FR-006

### Implementation for User Story 2

- [ ] T036 [P] [US2] Create Vuetify 3 theme configuration in `src/plugins/vuetify.ts` with soft pastel colors, calm palette (inspired by Sleep Cycle per plan.md), dark mode option respecting system preference
- [ ] T037 [P] [US2] Create `src/assets/styles/typography.css` with readable font sizes (≥16px base), line-height ≥1.5, letter-spacing for readability per spec.md FR-007 WCAG AA
- [ ] T038 [P] [US2] Create CSS modules or global styles in `src/assets/styles/animations.css` with gentle fade-in, slide-up, and other transitions ≥500ms duration, conditional on `prefers-reduced-motion` media query per spec.md SC-005/FR-006
- [ ] T039 [US2] Update `src/layouts/default.vue` with calm background, subtle gradients, whitespace-rich design, zero jarring colors per spec.md FR-005 (minimal, calm visual context)
- [ ] T040 [P] [US2] Create `src/components/Header.vue` (if needed) and `src/components/Footer.vue` with minimal branding, optional support email/privacy links per plan.md, soft colors, accessible links
- [ ] T041 [P] [US2] Implement color contrast validation: ensure all text on backgrounds has ≥4.5:1 contrast ratio (automated check in build or CI per spec.md SC-004)
- [ ] T042 [US2] Conduct user feedback session: 5+ female student testers rate emotional tone on 5-point scale in user testing feedback form, document results targeting mean ≥4.0/5 per spec.md SC-006
- [ ] T043 [P] [US2] Create documentation `src/STYLING.md` explaining color palette, typography choices, animation philosophy, how to respect reduced-motion (developer guide per constitution.md code style)

**Checkpoint**: User Story 2 complete — UI is calm, accessible, emotionally safe, passes contrast/a11y audits, achieves ≥4/5 emotional tone rating from user testing

---

## Phase 5: User Story 3 — Access Multiple Messages Over Time (No Replay) (Priority: P3)

**Goal**: Ensure users experience the full 365-day journey sequentially with no ability to skip, manipulate, or replay messages; handle completion gracefully after day 365

**Independent Test**: Can verify independently by:
1. Simulating date progression (day 0 → day 1 → day 100 → day 365 → day 366)
2. Confirming message sequence increments correctly
3. Verifying no UI exists to skip/select messages
4. Confirming completion screen appears and persists after day 365

### Tests for User Story 3 (OPTIONAL - included per spec requirement)

- [ ] T044 [P] [US3] Create 365-day journey simulation test `tests/integration/365DayJourney.test.ts` using date mocking, verifying day index increments from 0 to 364 sequentially per spec.md acceptance scenario 2-3
- [ ] T045 [P] [US3] Create completion screen test `tests/e2e/completionFlow.spec.ts` simulating day 366+, verifying completion screen displays and no further message changes per spec.md acceptance scenario 3 and clarification Q1

### Implementation for User Story 3

- [ ] T046 [P] [US3] Create state machine transitions in `src/composables/useMessageIndex.ts`: COMING_SOON (dayIndex < 0) → UNLOCKED (0 ≤ dayIndex ≤ 364) → COMPLETED (dayIndex > 364) per data-model.md state machine
- [ ] T047 [US3] Create `src/pages/completed.vue` (completion screen) displaying message like "You've completed your 365-day journey. Thank you for joining us." with no further message updates per spec.md User Story 3 acceptance scenario 3 and data-model.md COMPLETED state
- [ ] T048 [P] [US3] Implement route guards in `src/middleware/journeyState.ts` or page <script> setup logic: if state === COMPLETED, route to completed.vue; if state === COMING_SOON, route to coming-soon.vue; if state === UNLOCKED, route to index.vue per data-model.md state transitions
- [ ] T049 [US3] Update `src/pages/index.vue` to validate that no UI controls for message selection, skipping, or replay exist (accessibility audit confirms this per spec.md FR-004 and acceptance scenario 1)
- [ ] T050 [P] [US3] Create localStorage persistence in `src/services/journeyState.ts` saving lastSeenDate (informational, not enforcing; per clarification Q3 "trust users") to localStorage for user awareness of potential clock manipulation
- [ ] T051 [US3] Create edge case handler: if device date < startDate, show coming-soon page; if date === startDate and time < 06:00 AM, show placeholder or previous day's message per data-model.md edge cases EC-1/EC-2
- [ ] T052 [P] [US3] Create timezone handling in `src/utils/dateCalculation.ts` using local device timezone exclusively (no server-side calculation) per data-model.md edge case EC-4 timezone change
- [ ] T053 [US3] Add unit tests for edge cases in `tests/unit/edgeCases.test.ts`: before startDate, 5:59 AM on startDate, clock forward (localStorage tracking), timezone changes per data-model.md EC-1 through EC-4

**Checkpoint**: User Story 3 complete — 365-day journey works end-to-end, completion screen functional, state machine enforced, edge cases handled, no replay/manipulation available to users

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Build, test, deploy, documentation, and final validation

- [ ] T054 Create `vercel.json` deployment configuration for static site generation in repository root per plan.md frontend-only constraint
- [ ] T055 [P] Create CI/CD workflow `.github/workflows/ci.yml` (GitHub Actions) running ESLint, Prettier, Vitest, Playwright on every PR per constitution.md development workflow
- [ ] T056 [P] Update `package.json` with build scripts: `npm run dev` (dev server), `npm run build` (static generation), `npm run test` (Vitest), `npm run test:e2e` (Playwright), `npm run lint` (ESLint), `npm run format` (Prettier)
- [ ] T057 [P] Create `tests/setup.ts` or `vitest.config.ts` with Vitest configuration, test utilities, date mocking helpers for testing time-sensitive logic
- [ ] T058 Create README.md with project overview, setup instructions, feature summary, contribution guidelines per constitution.md code style
- [ ] T059 [P] Populate 365 actual messages in `src/assets/messages.json` with emotionally supportive, motivational content for female students (or use placeholder template for demo)
- [ ] T060 [P] Verify build: run `npm run build` and confirm `dist/` artifact is static (no Node.js runtime required) per plan.md static deployment constraint
- [ ] T061 Verify Vercel deployment: connect repository to Vercel, confirm automatic preview deploys on PRs and production deployment on merge to main per plan.md and constitution.md
- [ ] T062 [P] Create `CONTRIBUTING.md` with branch naming (`feat/`, `fix/`), PR review requirements (1 maintainer for patches, 2 for major changes per constitution.md), semantic versioning guidance
- [ ] T063 Final validation: run full test suite (`npm run test && npm run test:e2e`), confirm all tests pass, all accessibility checks pass, all edge cases covered per spec.md SC-001 through SC-008

**Checkpoint**: Project complete, tested, documented, deployed to Vercel, ready for production use

---

## Dependency Graph & Sequencing

### Critical Path (Must Complete in Order)

1. **Phase 1** (T001-T008): Setup → All other phases depend on this
2. **Phase 2** (T009-T019): Foundational → All user stories depend on this
3. **Phase 3** (T020-T032): User Story 1 (P1) → Can proceed to Phase 4 in parallel with Phase 5
4. **Phase 4** (T033-T043): User Story 2 (P2) → Can proceed in parallel with Phase 5
5. **Phase 5** (T044-T053): User Story 3 (P3) → Can proceed in parallel with Phase 4
6. **Phase 6** (T054-T063): Polish & Deploy → Depends on all user stories complete

### Parallelization Opportunities

**Within Phase 1**: T003, T004, T005 (config files) can run in parallel with T006, T007, T008 (structure)

**Within Phase 2**: 
- T010, T011, T012, T013, T015, T018 can run in parallel (independent services/composables)
- T009, T014, T017, T019 must run after their dependencies are understood

**Within Phase 3, 4, 5**: All tests [P] can run in parallel; implementation tasks follow dependencies (marked in descriptions)

**Within Phase 6**: T055, T056, T057, T058, T059, T060 can run largely in parallel; T061 depends on T060

### MVP Scope (Minimum Viable Product)

**MVP = Phase 1 + Phase 2 + Phase 3 (User Story 1 only)**

- User can open app and see the correct daily message for today
- Message is date-locked (from startDate)
- Message changes automatically at 6:00 AM
- App is accessible (WCAG AA)
- App deploys as static site to Vercel

This is a complete, independently testable product that delivers the core value.

**Phase 4 & 5** add enhanced aesthetics (P2) and long-term journey experience (P3), making the full application.

---

## Task Statistics

| Metric | Value | Notes |
|--------|-------|-------|
| **Total Tasks** | 63 | T001 through T063 |
| **Phase 1 (Setup)** | 8 | Infrastructure |
| **Phase 2 (Foundational)** | 11 | Core services & composables |
| **Phase 3 (User Story 1)** | 13 | Daily message display + tests |
| **Phase 4 (User Story 2)** | 11 | Calm UI + tests |
| **Phase 5 (User Story 3)** | 10 | 365-day journey + tests |
| **Phase 6 (Polish)** | 10 | Deploy, test, docs |
| **Parallelizable [P]** | 24 | Can execute concurrently |
| **Story-Specific** | 34 | Marked [US1], [US2], [US3] |
| **Setup/Foundational** | 19 | No story label (Phases 1-2) |
| **Test Tasks** | 12 | Unit, integration, E2E, a11y, visual |

---

## Validation Checklist

Before considering implementation complete:

- [ ] All 10 functional requirements (FR-001 through FR-010) have ≥1 task each
- [ ] All 8 success criteria (SC-001 through SC-008) have ≥1 test task
- [ ] All 5 edge cases (EC-1 through EC-5) have ≥1 handling task
- [ ] All 3 user stories (P1, P2, P3) have complete task phases
- [ ] State machine (COMING_SOON → UNLOCKED → COMPLETED) implemented in Phase 5
- [ ] Date calculation formula tested in Phase 2 & Phase 3
- [ ] Accessibility (WCAG AA, prefers-reduced-motion) tested in Phase 4
- [ ] 365 messages loaded and validated in Phase 2
- [ ] Build produces static artifact (no Node.js runtime) in Phase 6
- [ ] Vercel deployment configured in Phase 6

---

## Next Steps

1. **Execute Phase 1**: Initialize Nuxt 3 project, install dependencies, create project structure (T001-T008)
2. **Execute Phase 2**: Build foundational services, composables, configuration (T009-T019)
3. **Execute Phase 3 + 4 + 5 in parallel** (once Phase 2 complete): Implement user stories with their tests
4. **Execute Phase 6**: Build, test, document, deploy

Use `/speckit.implement` to track implementation progress and generate code for each task.
