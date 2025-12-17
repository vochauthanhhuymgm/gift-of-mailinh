# Quickstart: Daily Life-Healing Suggestions

**Phase**: 1 (Design)  
**Date**: 2025-12-17  
**Audience**: Developers setting up the project for the first time

---

## Prerequisites

- **Node.js**: 18+ (check with `node --version`)
- **npm** or **yarn**: Latest stable version
- **Git**: For version control and feature branches
- **Text Editor**: VS Code, WebStorm, or similar
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge) with DevTools

---

## Quick Setup (5 minutes)

### 1. Clone & Install

```bash
# Clone the repository
git clone <repo-url> life-suggestion-app
cd life-suggestion-app

# Install dependencies
npm install
```

### 2. Set Environment Variables

Create `.env.local` in the project root:

```bash
# Copy the example
cp .env.example .env.local

# Edit .env.local
VITE_START_DATE=2025-12-18
VITE_APP_NAME="Daily Life Suggestions"
VITE_UNLOCKED_HOUR=6
VITE_UNLOCKED_MINUTE=0
```

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser. You should see the app with today's message.

### 4. Run Tests

```bash
# Unit tests
npm run test

# E2E tests (requires app running)
npm run test:e2e

# Linting and formatting
npm run lint
npm run format
```

---

## Project Structure Overview

```
frontend/
├── src/
│   ├── components/          # Reusable Vue components
│   ├── composables/         # Reusable logic (date, animations)
│   ├── pages/               # Nuxt pages (home, coming-soon, completed)
│   ├── services/            # Business logic (messageService)
│   ├── assets/              # Static assets (messages.json, styles, images)
│   ├── app.vue              # Root component
│   └── nuxt.config.ts       # Nuxt configuration
├── tests/
│   ├── unit/                # Unit tests (Vitest)
│   ├── integration/         # Integration tests (Playwright)
│   └── e2e/                 # End-to-end tests (Playwright)
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── .eslintrc.cjs            # ESLint config
├── .prettierrc.json         # Prettier config
└── README.md                # Full documentation
```

---

## Core Files to Understand

### 1. `src/assets/messages.json`

Contains 365 messages, one per day. Example:

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
  ]
}
```

**To add/edit messages**: Simply edit this JSON file and rebuild.

### 2. `src/composables/useMessageIndex.ts`

Core logic for fetching and calculating the current message:

```typescript
export const useMessageIndex = () => {
  const currentMessage = ref<Message | undefined>();
  const state = ref<'coming-soon' | 'unlocked' | 'completed'>('coming-soon');
  const dayIndex = ref<number>(0);

  // Calculate day index based on startDate
  const calculateDayIndex = () => {
    const startDate = new Date(import.meta.env.VITE_START_DATE);
    const today = new Date();
    return Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Watch for state changes (e.g., at 6:00 AM)
  const refresh = () => {
    dayIndex.value = calculateDayIndex();
    // Fetch message, update state, etc.
  };

  onMounted(() => refresh());
  return { currentMessage, state, dayIndex, refresh };
};
```

### 3. `src/pages/index.vue`

Home page displaying the daily message:

```vue
<template>
  <div class="message-page">
    <div v-if="state === 'coming-soon'" class="coming-soon">
      <p>Your journey begins on {{ startDate }}. Get ready at 6:00 AM!</p>
    </div>
    <div v-else-if="state === 'completed'" class="completed">
      <p>You've completed your 365-day journey. Thank you for joining us. 🌟</p>
    </div>
    <div v-else class="message-display">
      <p class="day-counter">Day {{ dayIndex + 1 }} of 365</p>
      <p class="message-text">{{ currentMessage?.content }}</p>
      <p v-if="currentMessage?.author" class="message-author">— {{ currentMessage.author }}</p>
    </div>
  </div>
</template>
```

### 4. `src/assets/styles/global.css` & `themes.css`

Vuetify theme customization for calm colors:

```css
/* Example: soft, warm palette */
:root {
  --v-primary: #b39ddb;  /* Lavender */
  --v-secondary: #f8bbd0; /* Soft pink */
  --v-surface: #fafafa;   /* Off-white */
  --text-primary: #3e3e3e; /* Dark gray */
}
```

---

## Common Development Tasks

### Add a New Message

1. Edit `frontend/src/assets/messages.json`.
2. Add a new object to the `messages` array with `id` (0-364), `content`, and optional `author`/`theme`.
3. Ensure all 365 indices are filled.
4. Save and rebuild: `npm run dev` (hot reload).

### Change Start Date

1. Edit `.env.local`:
   ```
   VITE_START_DATE=2026-01-01
   ```
2. Save. The app will recalculate day indices on next load.

### Change Unlock Time (e.g., to 7:00 AM instead of 6:00 AM)

1. Edit `.env.local`:
   ```
   VITE_UNLOCKED_HOUR=7
   VITE_UNLOCKED_MINUTE=0
   ```
2. Update `src/composables/useDateLock.ts` to use these env vars.
3. Rebuild: `npm run dev`.

### Test a Different Date

1. Temporarily override the system date in DevTools (Emulation > Date/Time) or use a test utility.
2. In `src/composables/useMessageIndex.ts`, add a test mode:
   ```typescript
   const testDate = ref(new Date()); // Override for testing
   const today = testDate.value || new Date();
   ```

### Run Tests

```bash
# All tests
npm run test

# Watch mode (re-run on file changes)
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test file
npm run test -- useMessageIndex.spec.ts
```

### Build for Production

```bash
# Generate static site (Vercel deployment)
npm run build

# Preview the build locally
npm run preview
```

The build output will be in `dist/` — ready for Vercel.

### Deploy to Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Link and deploy**:
   ```bash
   vercel
   ```
   (Follow prompts; Vercel auto-detects Nuxt.)

3. **Set environment variables in Vercel dashboard**:
   - `VITE_START_DATE`
   - `VITE_APP_NAME`
   - Any other `VITE_*` vars

4. **Verify**: Open the Vercel deployment URL.

---

## Debugging Tips

### Message Not Showing

1. Check **dev console** for errors (F12 → Console).
2. Verify `messages.json` loads: Open Network tab, search for `messages.json`. Should return 200.
3. Check **date calculation**: In console, run:
   ```javascript
   const startDate = new Date('2025-12-18');
   const today = new Date();
   console.log(Math.floor((today - startDate) / (1000 * 60 * 60 * 24)));
   ```
   This should match the `dayIndex` in the app.

### 6:00 AM Transition Not Working

1. Check if `prefers-reduced-motion` is enabled on your device/browser (may affect animations).
2. Test by manually changing system time in DevTools.
3. Check if `useDateLock.ts` is properly calculating the unlock time.

### Styling Issues (Colors Too Bright, Text Too Small)

1. Check `themes.css` and `global.css` for overrides.
2. Ensure Vuetify theme is applied: Open DevTools → Inspect → Check computed styles.
3. If using a custom Vuetify theme, verify it's loaded in `nuxt.config.ts`.

### Build Fails

1. Run `npm install` to ensure all dependencies are installed.
2. Check Node version: `node --version` (should be 18+).
3. Check for `.env.local` file: `VITE_START_DATE` must be set.
4. Clear cache: `rm -rf node_modules dist .nuxt && npm install`.

---

## Next Steps

- **Read [data-model.md](data-model.md)** for entity definitions and state machine.
- **Read [contracts/openapi.yaml](contracts/openapi.yaml)** for service interfaces.
- **Start implementing** using the tasks in `/speckit.tasks` (to be generated).
- **Run tests** as you code: `npm run test:watch`.
- **Commit regularly**: Use feature branches (`feat/...` or `fix/...`).

---

## Useful Links

- **Nuxt 3 Documentation**: https://nuxt.com/
- **Vue 3 Composition API**: https://vuejs.org/guide/extras/composition-api-faq.html
- **Vuetify Documentation**: https://vuetifyjs.com/
- **Vitest Documentation**: https://vitest.dev/
- **Playwright Documentation**: https://playwright.dev/
- **Vercel Deployment Guide**: https://vercel.com/docs

---

## Getting Help

- **Tests failing?** Check `tests/` directory for examples. Run `npm run test -- --reporter=verbose`.
- **Accessibility issues?** Use Axe DevTools or Lighthouse (DevTools → Lighthouse).
- **Performance issues?** Check Bundle Analysis: `npm run build && npm run build:analyze`.
- **Questions?** Open an issue on GitHub or contact the team.

---

Happy coding! 🚀

