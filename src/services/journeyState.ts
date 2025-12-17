/**
 * Journey State Service
 * Persists and retrieves journey metadata to localStorage
 * Used for user awareness (informational only, not enforced)
 * Per spec clarification: "Trust users - don't enforce via localStorage"
 */

const STORAGE_KEY = 'daily-suggestions:journey-state';

interface JourneyMetadata {
  lastSeenDate?: string; // ISO date string (YYYY-MM-DD)
  lastSeenDayIndex?: number; // 0-364
  completionDate?: string; // ISO date string when journey completed
  startDate: string; // ISO date string of journey start
}

class JourneyStateService {
  /**
   * Save journey metadata to localStorage
   */
  saveJourneyMetadata(metadata: JourneyMetadata): void {
    if (!process.client) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
    } catch (error) {
      console.warn('Failed to save journey metadata:', error);
      // Fail silently - localStorage not critical to functionality
    }
  }

  /**
   * Retrieve journey metadata from localStorage
   */
  getJourneyMetadata(): JourneyMetadata | null {
    if (!process.client) return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to retrieve journey metadata:', error);
      return null;
    }
  }

  /**
   * Update last seen date to inform user of potential clock manipulation
   * NOT enforced - user can set clock backward and we show previous messages
   * This is intentional per spec clarification Q3
   */
  updateLastSeenDate(date: Date, dayIndex: number): void {
    const metadata = this.getJourneyMetadata() || { startDate: '' };
    metadata.lastSeenDate = this.formatDateISO(date);
    metadata.lastSeenDayIndex = dayIndex;
    this.saveJourneyMetadata(metadata);
  }

  /**
   * Mark journey as completed
   */
  markCompletionDate(date: Date, startDate: Date): void {
    const metadata = this.getJourneyMetadata() || { startDate: this.formatDateISO(startDate) };
    metadata.completionDate = this.formatDateISO(date);
    this.saveJourneyMetadata(metadata);
  }

  /**
   * Check if user has already completed the journey
   * (informational only - user could set clock backward)
   */
  hasCompletedJourney(): boolean {
    const metadata = this.getJourneyMetadata();
    return !!metadata?.completionDate;
  }

  /**
   * Get last known day index (informational)
   */
  getLastSeenDayIndex(): number | null {
    const metadata = this.getJourneyMetadata();
    return metadata?.lastSeenDayIndex ?? null;
  }

  /**
   * Clear journey metadata (useful for testing)
   */
  clearMetadata(): void {
    if (!process.client) return;

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear journey metadata:', error);
    }
  }

  /**
   * Format date as ISO string (YYYY-MM-DD)
   */
  private formatDateISO(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}

export const journeyStateService = new JourneyStateService();

export const useJourneyState = () => {
  return journeyStateService;
};
