/**
 * Core TypeScript interfaces for Daily Life-Healing Suggestions app
 * Based on data-model.md specification
 */

/**
 * Message Entity (0-364 days)
 * Represents a single daily life-healing suggestion
 */
export interface Message {
  id: number; // 0-364, directly maps to day index
  content: string; // Main message text, ≤500 chars
  author?: string; // Optional author/credit
  theme?: string; // Optional thematic category (self-care, resilience, gratitude, etc.)
  createdAt?: string; // ISO 8601 date for audit trail
}

/**
 * Configuration Entity
 * Build-time constants for the entire app, immutable at runtime
 */
export interface Configuration {
  startDate: string; // ISO 8601 date (YYYY-MM-DD) when day 0 unlocks
  appName: string; // Application name
  appDescription?: string; // Short description for meta tags
  timezone?: string; // Informational only; app uses device timezone
  unlockedHour: number; // Hour of day messages unlock (0-23)
  unlockedMinute: number; // Minute of hour messages unlock (0-59)
  messageMinLength?: number; // Minimum message length validation
  messageMaxLength?: number; // Maximum message length (soft: 500)
  supportEmail?: string; // Optional support contact
  privacyPolicy?: string; // Optional privacy policy URL
}

/**
 * Journey State
 * Current state in the 365-day journey
 */
export type JourneyState = 'COMING_SOON' | 'UNLOCKED' | 'COMPLETED';

/**
 * App State
 * Global reactive state for the application
 */
export interface AppState {
  currentMessage: Message | null; // Currently displayed message
  dayIndex: number; // Current day (0-364+; can be negative or >364)
  state: JourneyState; // COMING_SOON, UNLOCKED, or COMPLETED
  isMessageUnlocked: boolean; // Whether today's message is available (time-based)
  isLoading: boolean; // Data loading state
  error: string | null; // Any errors during message load/calculation
}

/**
 * Message Service Response
 * Result of loading and validating messages
 */
export interface MessageValidationResult {
  isValid: boolean;
  errors: string[];
  totalMessages?: number;
}

/**
 * Date Lock validation result
 */
export interface DateLockResult {
  currentDayIndex: number;
  isMessageUnlocked: boolean;
  journeyStarted: boolean;
  journeyCompleted: boolean;
}
