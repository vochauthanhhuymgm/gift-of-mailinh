<template>
  <div class="home-page">
    <!-- Coming Soon Screen (before startDate) -->
    <div v-if="state === 'COMING_SOON'" class="coming-soon-screen">
      <!-- <div class="coming-soon-content">
        <h1 class="headline">Get Ready</h1>
        <p class="coming-soon-message subtext">Your 365-day emotional healing journey begins on</p>
        <p class="coming-soon-date">{{ formatDate(dateLock.getStartDate()) }}</p>
        <p class="coming-soon-subtitle subtext">at 6:00 AM local time</p>
        <p class="coming-soon-subtext subtext">
          Prepare yourself for daily inspiration, encouragement, and emotional support.
        </p>
      </div> -->
      <coming-soon />
    </div>

    <!-- Completed Screen (after day 365) -->
    <div v-else-if="state === 'COMPLETED'" class="completed-screen">
      <div class="completed-content">
        <h1 class="headline">Journey Complete</h1>
        <p class="completed-message subtext">
          You've completed your 365-day emotional healing journey.
        </p>
        <p class="completed-subtext subtext">
          Thank you for taking this time to care for yourself. Remember, healing is a continuous
          practice.
        </p>
        <p class="completed-note subtext">
          You started on {{ formatDate(dateLock.getStartDate()) }} and completed on
          {{ formatDate(dateLock.getCompletionDate()) }}.
        </p>
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
    <div
      v-if="isLoading && !currentMessage"
      class="loading-screen"
      aria-live="polite"
      aria-busy="true"
    >
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
  import ComingSoon from '~/pages/coming-soon.vue';
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
        content:
          'Start your 365-day journey of emotional healing with daily life suggestions and encouragement.',
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
    text-align: center;
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

  .coming-soon-content,
  .completed-content {
    position: relative;
    background-color: rgba(8, 12, 24, 0.35);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: var(--spacing-xl);
    border-radius: 1.75rem;
    max-width: 90%;
    width: 640px;
    box-shadow: 0 25px 70px rgba(3, 5, 9, 0.65);
    overflow: hidden;
  }

  .coming-soon-content::before,
  .completed-content::before {
    content: '';
    position: absolute;
    inset: -30px -20px auto -20px;
    height: 60%;
    background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.28), transparent 70%);
    pointer-events: none;
  }

  .coming-soon-content h1 {
    margin-bottom: var(--spacing-lg);
  }

  .coming-soon-message {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-md);
  }

  .coming-soon-date {
    font-size: var(--font-size-2xl);
    color: #ffffff;
    font-weight: 600;
    margin-bottom: var(--spacing-md);
  }

  .coming-soon-subtitle {
    font-size: var(--font-size-base);
    margin-bottom: var(--spacing-lg);
  }

  .coming-soon-subtext {
    font-size: var(--font-size-sm);
    line-height: var(--line-height-relaxed);
  }

  /* Completed Screen */
  .completed-screen {
    text-align: center;
  }

  .completed-content h1 {
    margin-bottom: var(--spacing-lg);
  }

  .completed-message {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-md);
  }

  .completed-subtext {
    font-size: var(--font-size-base);
    line-height: var(--line-height-relaxed);
    margin-bottom: var(--spacing-lg);
  }

  .completed-note {
    font-size: var(--font-size-sm);
  }

  /* Message Screen */
  .next-message-info {
    text-align: center;
    margin-top: var(--spacing-lg);
    color: rgba(255, 255, 255, 0.8);
  }

  .next-message-text {
    font-size: var(--font-size-sm);
    margin-bottom: var(--spacing-sm);
  }

  .countdown {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: #ffffff;
    font-family: 'Monaco', 'Courier New', monospace;
    text-shadow:
      0 0 12px rgba(255, 255, 255, 0.9),
      0 0 30px rgba(169, 236, 255, 0.6),
      0 0 45px rgba(255, 255, 255, 0.35);
    animation: pulse-glow 2s infinite;
  }

  @keyframes pulse-glow {
    0%,
    100% {
      text-shadow:
        0 0 12px rgba(255, 255, 255, 0.9),
        0 0 30px rgba(169, 236, 255, 0.6),
        0 0 45px rgba(255, 255, 255, 0.35);
    }
    50% {
      text-shadow:
        0 0 18px rgba(255, 255, 255, 1),
        0 0 40px rgba(169, 236, 255, 0.8),
        0 0 60px rgba(255, 255, 255, 0.5);
    }
  }

  /* Loading Screen */
  .loading-screen {
    min-height: 300px;
    background-color: transparent;
    border-radius: var(--border-radius-lg);
    box-shadow: none;
    max-width: 500px;
  }

  .loading-screen p {
    color: rgba(255, 255, 255, 0.8);
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
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: var(--spacing-lg);
  }

  .error-screen button {
    background-color: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .error-screen button:hover {
    background-color: rgba(255, 255, 255, 0.35);
  }

  /* Headline and subtext typography */
  .headline {
    font-family: var(--font-family-serif);
    font-size: var(--font-size-3xl);
    color: #ffffff;
    letter-spacing: 0.2px;
  }

  .subtext {
    font-family: var(--font-family-base);
    color: rgba(255, 255, 255, 0.8);
  }

  /* Bottom-centered social proof */
  .social-proof {
    position: absolute;
    bottom: var(--spacing-md);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    color: #ffffff;
  }

  .badge {
    border: 1px solid rgba(255, 255, 255, 0.6);
    color: #ffffff;
    padding: 6px 12px;
    border-radius: 9999px;
    font-size: var(--font-size-sm);
    backdrop-filter: blur(2px);
  }

  .rating {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--font-size-sm);
  }

  .star {
    font-size: 1rem;
    color: #ffffff;
  }

  .star.dim {
    opacity: 0.35;
  }

  .rating-text {
    color: rgba(255, 255, 255, 0.8);
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
