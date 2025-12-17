/**
 * Application configuration constants
 * Immutable values set at build time
 */

export const appConfig = {
  // Message unlock time (local device time)
  UNLOCKED_HOUR: parseInt(process.env.VITE_UNLOCKED_HOUR || '6'),
  UNLOCKED_MINUTE: parseInt(process.env.VITE_UNLOCKED_MINUTE || '0'),

  // Message validation constraints
  MESSAGE_MIN_LENGTH: 20,
  MESSAGE_MAX_LENGTH: 500,
  TOTAL_MESSAGES: 365,

  // Journey days
  FIRST_DAY_INDEX: 0,
  LAST_DAY_INDEX: 364,
  TOTAL_DAYS: 365,

  // Predefined message themes
  MESSAGE_THEMES: [
    'self-care',
    'resilience',
    'gratitude',
    'growth',
    'courage',
    'mindfulness',
    'hope',
    'strength',
    'acceptance',
    'peace',
  ] as const,

  // Animation durations (respects prefers-reduced-motion)
  ANIMATION_DURATION_MS: 500, // Gentle, ≥500ms per spec
  ANIMATION_DURATION_REDUCED_MOTION_MS: 0, // No animation if reduced-motion

  // API/Data endpoints
  MESSAGES_JSON_PATH: '/messages.json',

  // Timezone handling
  USE_LOCAL_TIMEZONE: true, // Always use device local timezone
};

export type MessageTheme = (typeof appConfig.MESSAGE_THEMES)[number];
