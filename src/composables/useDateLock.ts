/**
 * useDateLock Composable
 * Validates current date against startDate and determines message unlock state
 * Based on contracts/openapi.yaml and data-model.md
 */

import { computed, ref } from 'vue';
import { appConfig } from '~/config';
import {
  calculateDayIndex,
  isMessageUnlockedAtTime,
  getMillisUntilNextUnlock,
  parseISODate,
} from '~/utils/dateCalculation';

export interface UseDateLockReturn {
  /**
   * Get the current day index (0-364+)
   * Can be negative if before startDate, or >364 if after completion
   */
  getCurrentDayIndex: () => number;

  /**
   * Check if the current time has unlocked today's message (>= unlock time local)
   */
  isMessageUnlocked: () => boolean;

  /**
   * Get the startDate configuration
   */
  getStartDate: () => Date;

  /**
   * Check if the journey has started (current date >= startDate)
   */
  hasJourneyStarted: () => boolean;

  /**
   * Check if the journey has completed (day index >= 365)
   */
  hasJourneyCompleted: () => boolean;

  /**
   * Get the date when the journey completes (startDate + 365 days)
   */
  getCompletionDate: () => Date;

  /**
   * Get milliseconds until next message unlock
   */
  getTimeUntilNextUnlock: () => number;
}

/**
 * Create a date lock instance for a given startDate
 * Can be called with custom startDate for testing
 */
export function createDateLock(customStartDate?: string): UseDateLockReturn {
  const config = useRuntimeConfig();
  const startDateStr = customStartDate || config.public.startDate;
  const startDate = parseISODate(startDateStr);

  const getCurrentDayIndex = (): number => {
    return calculateDayIndex(startDate);
  };

  const isMessageUnlocked = (): boolean => {
    const dayIndex = getCurrentDayIndex();

    // Not started yet
    if (dayIndex < 0) {
      return false;
    }

    // Journey completed
    if (dayIndex >= appConfig.TOTAL_DAYS) {
      return false;
    }

    // Check if current time >= unlock time
    return isMessageUnlockedAtTime(
      appConfig.UNLOCKED_HOUR,
      appConfig.UNLOCKED_MINUTE
    );
  };

  const getStartDate = (): Date => startDate;

  const hasJourneyStarted = (): boolean => {
    return getCurrentDayIndex() >= 0;
  };

  const hasJourneyCompleted = (): boolean => {
    return getCurrentDayIndex() >= appConfig.TOTAL_DAYS;
  };

  const getCompletionDate = (): Date => {
    const completion = new Date(startDate);
    completion.setDate(completion.getDate() + appConfig.TOTAL_DAYS);
    return completion;
  };

  const getTimeUntilNextUnlock = (): number => {
    return getMillisUntilNextUnlock(
      appConfig.UNLOCKED_HOUR,
      appConfig.UNLOCKED_MINUTE
    );
  };

  return {
    getCurrentDayIndex,
    isMessageUnlocked,
    getStartDate,
    hasJourneyStarted,
    hasJourneyCompleted,
    getCompletionDate,
    getTimeUntilNextUnlock,
  };
}

/**
 * Composable hook for using date lock in Vue components
 * Automatically uses startDate from runtime config
 */
export function useDateLock(): UseDateLockReturn {
  return createDateLock();
}

/**
 * Reactive version of date lock that updates with reactive refs
 * Useful for real-time updates (e.g., countdown timers)
 */
export function useReactiveDateLock() {
  const config = useRuntimeConfig();
  const startDate = parseISODate(config.public.startDate);

  // Force update every second (for real-time countdown)
  const now = ref<Date>(new Date());

  // Update time every second when component is mounted
  if (process.client) {
    let interval: ReturnType<typeof setInterval> | null = null;

    const startTimer = () => {
      if (interval) return;
      interval = setInterval(() => {
        now.value = new Date();
      }, 1000);
    };

    const stopTimer = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    // Auto-cleanup on component unmount
    if (process.client && typeof onBeforeUnmount !== 'undefined') {
      onBeforeUnmount(() => stopTimer());
    }

    startTimer();
  }

  const dayIndex = computed(() => calculateDayIndex(startDate, now.value));
  const isUnlocked = computed(() => {
    const day = dayIndex.value;
    if (day < 0 || day >= appConfig.TOTAL_DAYS) return false;
    return isMessageUnlockedAtTime(
      appConfig.UNLOCKED_HOUR,
      appConfig.UNLOCKED_MINUTE,
      now.value
    );
  });
  const journeyStarted = computed(() => dayIndex.value >= 0);
  const journeyCompleted = computed(() => dayIndex.value >= appConfig.TOTAL_DAYS);
  const timeUntilNextUnlock = computed(() =>
    getMillisUntilNextUnlock(
      appConfig.UNLOCKED_HOUR,
      appConfig.UNLOCKED_MINUTE,
      now.value
    )
  );

  return {
    dayIndex,
    isUnlocked,
    journeyStarted,
    journeyCompleted,
    timeUntilNextUnlock,
    getCurrentDayIndex: () => dayIndex.value,
    isMessageUnlocked: () => isUnlocked.value,
    getStartDate: () => startDate,
    hasJourneyStarted: () => journeyStarted.value,
    hasJourneyCompleted: () => journeyCompleted.value,
    getCompletionDate: () => {
      const completion = new Date(startDate);
      completion.setDate(completion.getDate() + appConfig.TOTAL_DAYS);
      return completion;
    },
    getTimeUntilNextUnlock: () => timeUntilNextUnlock.value,
  };
}
