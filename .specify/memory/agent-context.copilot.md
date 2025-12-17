# GitHub Copilot Agent Context — Daily Life-Healing Suggestions

**Last Updated**: 2025-12-17  
**Project**: Daily Life-Healing Suggestions (365-Day Journey)  
**Feature Branch**: `001-daily-suggestions`

---

## Project Overview

Build a frontend-only web application that delivers one daily life-healing suggestion over a 365-day journey. Messages are date-locked (based on a fixed `startDate`), displayed at 6:00 AM local time, with a calm, soothing UI inspired by Sleep Cycle. All 365 messages are pre-defined, stored as static JSON, and the app deploys to Vercel as a static site.

---

## Tech Stack

### Frontend
- **Framework**: Nuxt.js 3 with Vue 3 (Composition API)
- **UI Library**: Vuetify 3
- **Language**: JavaScript or TypeScript (recommended)
- **Package Manager**: npm or yarn
- **Node.js**: 18+

### Testing
- **Unit Tests**: Vitest
- **Integration/E2E Tests**: Playwright
- **Test Runner**: Vitest CLI, Playwright CLI

### Build & Deployment
- **Static Generation**: `nuxi generate` (produces static HTML/CSS/JS)
- **Hosting**: Vercel (or any CDN)
- **Build Tool**: Vite (via Nuxt)
- **Code Quality**: ESLint, Prettier

### Data & Storage
- **Message Storage**: Static JSON (`messages.json`), 365 messages bundled at build time
- **Database**: None (frontend-only)
- **Backend API**: None

---

## Key Files & Directories

```
frontend/
├── src/
│   ├── components/            # Reusable Vue components
│   │   ├── MessageDisplay.vue # Main message rendering
│   │   └── ...
│   ├── composables/           # Reusable logic
│   │   ├── useMessageIndex.ts # Date calculation, message selection
│   │   ├── useDateLock.ts     # Date validation
│   │   └── useAnimation.ts    # Smooth transitions
│   ├── pages/                 # Nuxt pages
│   │   ├── index.vue          # Home (daily message)
│   │   ├── coming-soon.vue    # Before startDate
│   │   └── completed.vue      # After day 365
│   ├── services/
│   │   └── messageService.ts  # Load 365 messages
│   ├── assets/
│   │   ├── messages.json      # 365 pre-defined messages
│   │   └── styles/            # Global CSS, Vuetify theme
│   ├── app.vue                # Root component
│   └── nuxt.config.ts         # Nuxt config, static generation
├── tests/
│   ├── unit/                  # Vitest unit tests
│   ├── integration/           # Playwright integration tests
│   └── e2e/                   # Playwright e2e tests
├── package.json               # Dependencies, scripts
├── .env.example               # Environment variables
├── .eslintrc.cjs              # ESLint config
├── .prettierrc.json           # Prettier config
└── vercel.json                # Vercel deployment config
```

---

## Core Composition & Responsibilities

### `useMessageIndex.ts` (Composable)
Combines date logic and message service to provide the current message and state.

```typescript
const {
  currentMessage,  // Ref<Message | undefined>
  state,           // 'coming-soon' | 'unlocked' | 'completed'
  dayIndex,        // 0-364+
  isUnlocked,      // boolean
  statusText,      // "Day 5 of 365"
  refresh,         // () => void
  onStateChange    // (callback) => void
} = useMessageIndex();
```

**Key Logic**:
- Calculate day index: `Math.floor((today - startDate) / 86400000)`
- Handle state transitions: before startDate (COMING_SOON) → unlocked (UNLOCKED) → after day 365 (COMPLETED)
- Watch for 6:00 AM unlock time (local device time)

### `messageService.ts` (Service)
Loads and provides 365 messages from static JSON.

```typescript
const messages = await messageService.loadMessages();  // Message[]
const msg = messageService.getMessageByIndex(index);   // Message | undefined
const isValid = messageService.validateMessages();     // { isValid, errors }
```

### Pages
- **`index.vue`**: Display current message; shows "Day X of 365" and author (if available)
- **`coming-soon.vue`**: Show placeholder before startDate; e.g., "Your journey begins on [startDate]"
- **`completed.vue`**: Show completion message after day 365; "You've completed your 365-day journey"

---

## Important Requirements

### Functional
- **FR-001**: Display exactly one message per day (deterministic date-based selection)
- **FR-002**: 365 unique messages, no repeats within a year
- **FR-003**: Unlock new messages at 6:00 AM local device time
- **FR-004**: No UI controls to skip or manually select messages
- **FR-005**: Calm, minimal UI with soft colors and gentle animations
- **FR-006**: Respect `prefers-reduced-motion` media query
- **FR-007**: WCAG AA accessible (contrast ≥4.5:1, semantic HTML)
- **FR-008**: Load without authentication or backend
- **FR-009**: **No personal data collection** (no analytics, tracking, or telemetry)
- **FR-010**: Deploy as static site to Vercel

### Non-Functional
- Initial load <3 seconds on 4G
- Animations ≥500ms (gentleness), <100ms if `prefers-reduced-motion` enabled
- JS bundle <200KB (gzipped)

### Constitutional Principles
1. **Privacy & No-Collection (NON-NEGOTIABLE)**: Zero user data collection
2. **Deterministic Date-Locked Delivery (NON-NEGOTIABLE)**: Pure date-based logic, no user skipping
3. **Frontend-Only Static Deployment (Vercel-ready)**: No backend, no serverless functions
4. **Simplicity, Accessibility & UX**: Calm, accessible, lightweight experience
5. **Maintainability, Testing & Versioning**: Nuxt 3 + Vue 3 Composition API, tests for date logic, semantic versioning

---

## Message Structure (messages.json)

```json
{
  "messages": [
    {
      "id": 0,
      "content": "You are capable of amazing things. Take one small step today.",
      "author": "Sarah",
      "theme": "self-care",
      "createdAt": "2025-12-01"
    },
    ...
    {
      "id": 364,
      "content": "You have grown. Celebrate every step of your journey.",
      "author": "Unknown",
      "theme": "gratitude",
      "createdAt": "2025-12-31"
    }
  ]
}
```

**Validation** (build-time):
- All 365 indices (0-364) must be present
- All `content` fields non-empty
- No duplicate IDs

---

## Configuration (Environment Variables)

Set in `.env.local` or `.env`:

```bash
VITE_START_DATE=2025-12-18           # ISO 8601 date
VITE_APP_NAME="Daily Life Suggestions"
VITE_UNLOCKED_HOUR=6                 # 6:00 AM
VITE_UNLOCKED_MINUTE=0
VITE_SUPPORT_EMAIL=support@example.com
VITE_PRIVACY_POLICY=https://...
```

All `VITE_*` vars are accessible in client code via `import.meta.env.VITE_*`.

---

## Development Workflow

### Start Dev Server
```bash
npm run dev
# App runs on http://localhost:3000
```

### Run Tests
```bash
npm run test                 # All tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
npm run test:e2e           # E2E tests
```

### Linting & Formatting
```bash
npm run lint               # ESLint check
npm run format             # Prettier format
npm run format:check       # Check without applying
```

### Build for Production
```bash
npm run build              # `nuxi generate` → dist/
npm run preview            # Preview build locally
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel                     # Link and deploy
```

---

## State Machine (Message Delivery)

```
COMING_SOON (before startDate)
    ↓ (current date >= startDate && time >= 06:00 AM)
UNLOCKED (day 0-364)
    ↓ (current date > startDate + 365 days)
COMPLETED (day 365+)
```

### Transitions
- **COMING_SOON → UNLOCKED**: Show "Coming Soon" placeholder until 6:00 AM on startDate
- **UNLOCKED → UNLOCKED**: Daily update at 6:00 AM; refresh message index
- **UNLOCKED → COMPLETED**: After day 365; show completion message; no more new messages

---

## Testing Priorities

### Unit Tests (Vitest)
1. **Date Calculation**: `useMessageIndex` returns correct day index for various dates
2. **Message Service**: Load 365 messages; handle edge cases (empty, invalid JSON)
3. **Date Lock**: Validate unlock time (6:00 AM), handle edge cases (before startDate, after day 365)

### Integration Tests (Playwright)
1. **Date Transitions**: Message changes at 6:00 AM local time
2. **Edge States**: COMING_SOON, UNLOCKED, COMPLETED render correctly
3. **Timezone Handling**: Message index correct across timezones
4. **Accessibility**: WCAG AA compliance (contrast, keyboard nav, screen reader)

### E2E Tests (Playwright)
1. **User Journey**: Open app → see daily message; no interaction needed
2. **Edge Cases**: System date manipulation, timezone change, offline behavior

---

## Accessibility Checklist

- [ ] Text contrast ≥4.5:1 (WCAG AA)
- [ ] Keyboard navigable (Tab, Enter)
- [ ] Semantic HTML (h1, p, figure, etc.)
- [ ] ARIA labels where needed
- [ ] `prefers-reduced-motion` respected (animations removed or <100ms)
- [ ] Font size ≥16px body text
- [ ] Line-height ≥1.5
- [ ] Tested with Axe DevTools or Lighthouse

---

## Security & Privacy

- **No Data Collection**: Zero tracking, analytics, or user identification
- **No Secrets in Source**: Build-time env vars only; .env.local in .gitignore
- **No Authentication**: Public app, no login
- **No External APIs**: All data bundled; no third-party API calls
- **Privacy Policy**: Optional; if present, must state "No personal data collected"

---

## Branch & Commit Strategy

- **Branch Name**: `001-daily-suggestions` (feature branch)
- **Commit Messages**: Follow conventional commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`)
- **PR Reviews**: All PRs reviewed; major changes (date logic, startDate) require 2 approvals
- **Merges**: Squash or rebase to `main`; tag releases with semantic version (v1.0.0, v1.1.0, etc.)

---

## Useful Snippets for Implementation

### Get Current Day Index
```typescript
const startDate = new Date(import.meta.env.VITE_START_DATE);
const today = new Date();
const dayIndex = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
```

### Check Unlock Time (6:00 AM)
```typescript
const now = new Date();
const unlockedHour = parseInt(import.meta.env.VITE_UNLOCKED_HOUR);
const unlockedMinute = parseInt(import.meta.env.VITE_UNLOCKED_MINUTE);
const isUnlocked = now.getHours() > unlockedHour || 
                    (now.getHours() === unlockedHour && now.getMinutes() >= unlockedMinute);
```

### Detect Reduced Motion
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

### Watch for State Changes (Reactive)
```typescript
watch(() => state.value, (newState) => {
  if (newState === 'completed') {
    triggerConfetti(); // or celebration animation
  }
});
```

---

## Debugging Commands

```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules dist .nuxt
npm install

# Check environment
echo $VITE_START_DATE

# Run tests with verbose output
npm run test -- --reporter=verbose

# Run specific test file
npm run test -- useMessageIndex.spec.ts

# Check bundle size
npm run build && npm run build:analyze

# Validate messages.json
npm run validate:messages  # If script exists
```

---

## Resources

- **Spec**: `specs/001-daily-suggestions/spec.md`
- **Data Model**: `specs/001-daily-suggestions/data-model.md`
- **API Contracts**: `specs/001-daily-suggestions/contracts/openapi.yaml`
- **Quickstart**: `specs/001-daily-suggestions/quickstart.md`
- **Constitution**: `.specify/memory/constitution.md`

---

## Next Phase

After implementation completes, run `/speckit.tasks` to generate a detailed task breakdown.

