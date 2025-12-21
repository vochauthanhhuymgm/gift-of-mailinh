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
    position: relative;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 1.5rem !important; /* 2xl */
    box-shadow: 0 25px 70px rgba(3, 5, 9, 0.65);
    overflow: hidden;
  }

  .message-card::before {
    content: '';
    position: absolute;
    inset: -40px -20px auto -20px;
    height: 65%;
    background: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.2), transparent 70%);
    pointer-events: none;
    opacity: 0.9;
  }

  .message-content {
    position: relative;
    z-index: 1;
  }

  .message-text {
    font-family: var(--font-family-serif);
    font-size: clamp(1.5rem, 2vw, 2.1rem);
    color: #f7fbff;
    line-height: 1.85;
    letter-spacing: 0.08em;
    max-width: 100%;
    word-wrap: break-word;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
  }

  .message-author {
    margin-top: 1.5rem;
  }

  .day-counter {
    margin-top: 1.5rem;
    background-color: rgba(212, 175, 55, 0.18) !important;
    color: #d4af37 !important;
    border: 1px solid rgba(212, 175, 55, 0.4) !important;
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.25);
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
