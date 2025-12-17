/**
 * Date calculation utilities for day index calculation
 * Based on data-model.md formula
 */

/**
 * Calculate the current day index (0-364+)
 * Formula: dayIndex = floor((currentDate - startDate) / 86400000 ms)
 *
 * @param startDate - ISO 8601 date string (YYYY-MM-DD) or Date object
 * @param currentDate - Optional current date (defaults to today)
 * @returns Day index: negative if before startDate, 0-364 during journey, >364 if completed
 */
export function calculateDayIndex(
  startDate: string | Date,
  currentDate: Date = new Date()
): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  // Reset to midnight local time for accurate day counting
  start.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  const diffMs = currentDate.getTime() - start.getTime();
  const oneDayMs = 1000 * 60 * 60 * 24;
  const dayIndex = Math.floor(diffMs / oneDayMs);

  return dayIndex;
}

/**
 * Check if a message is currently unlocked (based on time of day)
 * Message unlocks at configured hour/minute local device time
 *
 * @param unlockedHour - Hour when message unlocks (0-23)
 * @param unlockedMinute - Minute when message unlocks (0-59)
 * @param currentTime - Optional current time (defaults to now)
 * @returns true if current time >= unlock time, false otherwise
 */
export function isMessageUnlockedAtTime(
  unlockedHour: number,
  unlockedMinute: number,
  currentTime: Date = new Date()
): boolean {
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  // Check if current time >= unlock time
  if (hours > unlockedHour) return true;
  if (hours === unlockedHour && minutes >= unlockedMinute) return true;

  return false;
}

/**
 * Get time until next message unlock (in milliseconds)
 *
 * @param unlockedHour - Hour when message unlocks
 * @param unlockedMinute - Minute when message unlocks
 * @param currentTime - Optional current time
 * @returns Milliseconds until next unlock, or 0 if already unlocked
 */
export function getMillisUntilNextUnlock(
  unlockedHour: number,
  unlockedMinute: number,
  currentTime: Date = new Date()
): number {
  if (isMessageUnlockedAtTime(unlockedHour, unlockedMinute, currentTime)) {
    // Message already unlocked today, calculate time until tomorrow's unlock
    const tomorrow = new Date(currentTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(unlockedHour, unlockedMinute, 0, 0);
    return Math.max(0, tomorrow.getTime() - currentTime.getTime());
  } else {
    // Message not yet unlocked today, calculate time until today's unlock
    const unlockedToday = new Date(currentTime);
    unlockedToday.setHours(unlockedHour, unlockedMinute, 0, 0);
    return Math.max(0, unlockedToday.getTime() - currentTime.getTime());
  }
}

/**
 * Format a Date as ISO 8601 string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse ISO 8601 date string to Date object
 */
export function parseISODate(dateString: string): Date {
  const date = new Date(dateString);
  // Reset to midnight local time
  date.setHours(0, 0, 0, 0);
  return date;
}
