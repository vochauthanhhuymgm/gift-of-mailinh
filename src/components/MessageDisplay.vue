<template>
  <article class="message-display" role="main">
    <v-card class="message-card elevation-4" rounded="xl" :loading="isLoading">
      <v-card-text class="message-content pa-8">
        <!-- Message text with semantic markup -->
        <p class="message-text" v-if="message">
          {{ message.content }}
        </p>

        <!-- Loading state -->
        <div v-else-if="isLoading" class="message-loading" aria-live="polite" aria-busy="true">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
            class="mb-4"
          ></v-progress-circular>
          <p class="text-body-1 text-medium-emphasis">Loading your daily message...</p>
        </div>

        <!-- Error state -->
        <v-alert
          v-else-if="error"
          type="error"
          variant="tonal"
          rounded="lg"
          class="message-error"
          role="alert"
        >
          {{ error }}
        </v-alert>

        <!-- Author attribution if provided -->
        <p
          v-if="message?.author"
          class="message-author text-body-2 text-medium-emphasis font-italic mt-6"
        >
          — {{ message.author }}
        </p>

        <!-- Day counter -->
        <v-chip
          v-if="dayIndex >= 0 && dayIndex < 365"
          class="day-counter mt-6"
          color="#d4af37"
          variant="tonal"
          size="small"
        >
          Day {{ dayIndex + 1 }} of 365
        </v-chip>
      </v-card-text>
    </v-card>
  </article>
</template>

<script setup lang="ts" name="MessageDisplay">
  import { computed } from 'vue';
  import type { Message } from '~/types';

  interface Props {
    message: Message | null;
    dayIndex?: number;
    isLoading?: boolean;
    error?: string | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    dayIndex: -1,
    isLoading: false,
    error: null,
  });

  const dayIndex = computed(() => props.dayIndex);
</script>

<style scoped>
  .message-display {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  .message-card {
    background-color: transparent;
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.5rem !important; /* 2xl */
    box-shadow: 0 0 40px rgba(255, 255, 255, 0.05);
  }

  .message-text {
    font-family: var(--font-family-serif);
    font-size: var(--font-size-xl);
    color: #ffffff;
    line-height: var(--line-height-relaxed);
    letter-spacing: 0.5px;
  }

  .message-text {
    line-height: 1.75 !important;
    color: #ffffff;
    max-width: 100%;
    word-wrap: break-word;
  }

  .message-author {
    margin-top: 1.5rem;
  }

  .day-counter {
    margin-top: 1.5rem;
  }

  .message-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
  }

  .message-error {
    width: 100%;
  }

  /* Animation for message reveal */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .message-card {
    animation: fadeIn 0.6s ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    .message-card {
      animation: none;
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .message-content {
      min-height: 250px;
    }

    .message-text {
      font-size: 1.25rem !important;
    }
  }

  @media (max-width: 480px) {
    .message-text {
      font-size: 1.125rem !important;
    }
  }
</style>
