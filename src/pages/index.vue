<template>
  <div class="home-page">
    <!-- Coming Soon Screen (before startDate) -->
    <div v-if="state === 'COMING_SOON'" class="coming-soon-screen">
      <div class="coming-soon-content">
        <h1>Get Ready</h1>
        <p class="coming-soon-message">Your 365-day emotional healing journey begins on</p>
        <p class="coming-soon-date">{{ formatDate(dateLock.getStartDate()) }}</p>
        <p class="coming-soon-subtitle">at 6:00 AM local time</p>
        <p class="coming-soon-subtext">Prepare yourself for daily inspiration, encouragement, and emotional support.</p>
      </div>
    </div>

    <!-- Completed Screen (after day 365) -->
    <div v-else-if="state === 'COMPLETED'" class="completed-screen">
      <div class="completed-content">
        <h1>Journey Complete</h1>
        <p class="completed-message">You've completed your 365-day emotional healing journey.</p>
        <p class="completed-subtext">Thank you for taking this time to care for yourself. Remember, healing is a continuous practice.</p>
        <p class="completed-note">You started on {{ formatDate(dateLock.getStartDate()) }} and completed on {{ formatDate(dateLock.getCompletionDate()) }}.</p>
      </div>
    </div>

    <!-- Main Message Display (during journey) -->
    <div v-else-if="state === 'UNLOCKED' || dayIndex >= 0" class="message-screen">
      <MessageDisplay
        :message="currentMessage"
        :day-index="dayIndex"
        :is-loading="isLoading"
        :error="error"
      />

      <!-- Time until next message (optional) -->
      <div v-if="dayIndex >= 0 && dayIndex < 364" class="next-message-info">
        <p class="next-message-text">Next message available in:</p>
        <p class="countdown">{{ formatTimeUntilNext() }}</p>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading && !currentMessage" class="loading-screen" aria-live="polite" aria-busy="true">
      <p>Loading your daily message...</p>
    </div>

    <!-- Error state -->
    <div v-if="error" class="error-screen" role="alert">
      <h2>Something went wrong</h2>
      <p>{{ error }}</p>
      <button @click="retryLoad">Try again</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Message, JourneyState } from '~/types';
import { useMessageIndex } from '~/composables/useMessageIndex';
import { useDateLock } from '~/composables/useDateLock';
import { getMillisUntilNextUnlock, formatDateISO } from '~/utils/dateCalculation';
import MessageDisplay from '~/components/MessageDisplay.vue';

// Composables
const messageIndex = useMessageIndex();
const dateLock = useDateLock();

// State
const currentMessage = ref<Message | null>(null);
const state = ref<JourneyState>('COMING_SOON');
const dayIndex = ref<number>(-1);
const isLoading = ref(false);
const error = ref<string | null>(null);
const nextUnlockCountdown = ref<string>('Loading...');

// Computed
const timeUntilNext = computed(() => {
  if (dayIndex.value < 0 || dayIndex.value >= 364) return 0;
  return getMillisUntilNextUnlock(6, 0); // 6:00 AM unlock time
});

// Methods
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

const formatTimeUntilNext = (): string => {
  const ms = timeUntilNext.value;
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

const retryLoad = async () => {
  error.value = null;
  isLoading.value = true;
  try {
    await messageIndex.refresh();
    currentMessage.value = messageIndex.currentMessage.value;
    state.value = messageIndex.state.value;
    dayIndex.value = messageIndex.dayIndex.value;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load message';
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  isLoading.value = true;
  try {
    await messageIndex.refresh();

    // Subscribe to updates
    messageIndex.onStateChange((newState) => {
      state.value = newState;
    });

    // Update state
    currentMessage.value = messageIndex.currentMessage.value;
    state.value = messageIndex.state.value;
    dayIndex.value = messageIndex.dayIndex.value;

    // Update countdown every second
    const countdownInterval = setInterval(() => {
      const ms = getMillisUntilNextUnlock(6, 0);
      if (ms > 0) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);

        if (hours > 0) {
          nextUnlockCountdown.value = `${hours}h ${minutes}m`;
        } else if (minutes > 0) {
          nextUnlockCountdown.value = `${minutes}m ${seconds}s`;
        } else {
          nextUnlockCountdown.value = `${seconds}s`;
        }
      }
    }, 1000);

    if (process.client && typeof onBeforeUnmount !== 'undefined') {
      onBeforeUnmount(() => clearInterval(countdownInterval));
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load message';
  } finally {
    isLoading.value = false;
  }
});

// Metadata
useHead({
  title: 'Daily Life Suggestions - 365-Day Emotional Healing Journey',
  meta: [
    {
      name: 'description',
      content: 'Start your 365-day journey of emotional healing with daily life suggestions and encouragement.',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
  ],
});
</script>

<style scoped>
.home-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-screen,
.coming-soon-screen,
.completed-screen,
.loading-screen,
.error-screen {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
}

/* Coming Soon Screen */
.coming-soon-screen {
  text-align: center;
}

.coming-soon-content {
  background-color: var(--color-card);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 500px;
}

.coming-soon-content h1 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
}

.coming-soon-message {
  font-size: var(--font-size-lg);
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.coming-soon-date {
  font-size: var(--font-size-2xl);
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

.coming-soon-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-lg);
}

.coming-soon-subtext {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  line-height: var(--line-height-relaxed);
}

/* Completed Screen */
.completed-screen {
  text-align: center;
}

.completed-content {
  background-color: var(--color-card);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 500px;
}

.completed-content h1 {
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
}

.completed-message {
  font-size: var(--font-size-lg);
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
}

.completed-subtext {
  font-size: var(--font-size-base);
  color: var(--color-text);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
}

.completed-note {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

/* Message Screen */
.next-message-info {
  text-align: center;
  margin-top: var(--spacing-lg);
  color: var(--color-text-light);
}

.next-message-text {
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-sm);
}

.countdown {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
  font-family: 'Monaco', 'Courier New', monospace;
}

/* Loading Screen */
.loading-screen {
  min-height: 300px;
  background-color: var(--color-card);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  max-width: 500px;
}

.loading-screen p {
  color: var(--color-text-light);
}

/* Error Screen */
.error-screen {
  background-color: rgba(255, 0, 0, 0.05);
  border: 2px solid #ff6b6b;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  max-width: 500px;
  text-align: center;
}

.error-screen h2 {
  color: #d32f2f;
  margin-bottom: var(--spacing-md);
}

.error-screen p {
  color: var(--color-text);
  margin-bottom: var(--spacing-lg);
}

.error-screen button {
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.error-screen button:hover {
  background-color: var(--color-secondary);
}

/* Responsive */
@media (max-width: 768px) {
  .message-screen,
  .coming-soon-screen,
  .completed-screen {
    padding: var(--spacing-md);
  }

  .coming-soon-content,
  .completed-content {
    padding: var(--spacing-lg);
  }

  .coming-soon-content h1,
  .completed-content h1 {
    font-size: var(--font-size-2xl);
  }
}
</style>
