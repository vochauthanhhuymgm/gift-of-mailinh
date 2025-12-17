/**
 * useMessageIndex Composable
 * Main composable for managing message display state
 * Returns current message, journey state, and day index
 */

import { computed, ref, watch, onMounted } from 'vue';
import type { Message, JourneyState } from '~/types';
import { appConfig } from '~/config';
import { messageService } from '~/services/messageService';
import { useReactiveDateLock } from '~/composables/useDateLock';
import { getMillisUntilNextUnlock } from '~/utils/dateCalculation';

export interface UseMessageIndexReturn {
  /**
   * Current message to display (null if not available)
   */
  currentMessage: Ref<Message | null>;

  /**
   * Current journey state (COMING_SOON | UNLOCKED | COMPLETED)
   */
  state: Ref<JourneyState>;

  /**
   * Current day index (0-364+)
   */
  dayIndex: Ref<number>;

  /**
   * Whether current message is unlocked (time-based)
   */
  isUnlocked: Ref<boolean>;

  /**
   * Manually refresh the current message and state
   */
  refresh: () => Promise<void>;

  /**
   * Register callback for state changes
   */
  onStateChange: (callback: (state: JourneyState) => void) => void;
}

/**
 * Composable hook for displaying daily messages
 * Handles all message display logic, state transitions, and auto-refresh
 */
export function useMessageIndex(): UseMessageIndexReturn {
  const currentMessage = ref<Message | null>(null);
  const state = ref<JourneyState>('COMING_SOON');
  const dayIndex = ref<number>(-1);

  const dateLock = useReactiveDateLock();

  // Derived computed state
  const isUnlocked = computed(() => dateLock.isUnlocked);

  // State change callbacks
  const stateChangeCallbacks: ((state: JourneyState) => void)[] = [];

  const onStateChange = (callback: (newState: JourneyState) => void) => {
    stateChangeCallbacks.push(callback);
  };

  const notifyStateChange = (newState: JourneyState) => {
    stateChangeCallbacks.forEach((cb) => cb(newState));
  };

  /**
   * Update message display based on current date/time
   */
  const refresh = async (): Promise<void> => {
    // Ensure messages are loaded
    if (messageService.getMessageCount() === 0) {
      await messageService.loadMessages();
    }

    const currentDayIndex = dateLock.getCurrentDayIndex();
    dayIndex.value = currentDayIndex;

    // Determine journey state
    let newState: JourneyState;
    let newMessage: Message | null = null;

    if (currentDayIndex < 0) {
      // Journey not yet started
      newState = 'COMING_SOON';
      newMessage = null;
    } else if (currentDayIndex >= appConfig.TOTAL_DAYS) {
      // Journey completed
      newState = 'COMPLETED';
      newMessage = null;
    } else {
      // Journey in progress
      newState = 'UNLOCKED';
      // Get the message for this day
      newMessage = messageService.getMessageByIndex(currentDayIndex) || null;
    }

    // Update state if changed
    if (newState !== state.value) {
      state.value = newState;
      notifyStateChange(newState);
    }

    currentMessage.value = newMessage;
  };

  // Initial load on component mount
  onMounted(async () => {
    await refresh();

    // Set up auto-refresh for next message unlock
    const scheduleNextRefresh = () => {
      const timeUntilNext = dateLock.getTimeUntilNextUnlock();
      if (timeUntilNext > 0 && timeUntilNext < Infinity) {
        // Add 100ms buffer to ensure we're past the unlock time
        const timeout = setTimeout(() => {
          refresh();
          scheduleNextRefresh();
        }, timeUntilNext + 100);

        // Store timeout for cleanup
        if (process.client && typeof onBeforeUnmount !== 'undefined') {
          onBeforeUnmount(() => clearTimeout(timeout));
        }
      }
    };

    scheduleNextRefresh();
  });

  // Watch for day changes and refresh
  watch(
    () => dayIndex.value,
    async () => {
      await refresh();
    }
  );

  return {
    currentMessage,
    state,
    dayIndex,
    isUnlocked,
    refresh,
    onStateChange,
  };
}

/**
 * Alternative: Static usage of message index (for non-reactive scenarios)
 * Useful for SSR or when you don't need reactive updates
 */
export async function getMessageForDate(
  dateStr: string,
  startDateStr: string
): Promise<Message | null> {
  const { calculateDayIndex } = await import('~/utils/dateCalculation');
  const { parseISODate } = await import('~/utils/dateCalculation');

  await messageService.loadMessages();
  const dayIndex = calculateDayIndex(parseISODate(startDateStr), new Date(dateStr));

  if (dayIndex < 0 || dayIndex >= appConfig.TOTAL_DAYS) {
    return null;
  }

  return messageService.getMessageByIndex(dayIndex) || null;
}
