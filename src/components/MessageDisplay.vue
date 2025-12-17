<template>
  <article class="message-display" role="main">
    <div class="message-content">
      <!-- Message text with semantic markup -->
      <p class="message-text" v-if="message">{{ message.content }}</p>

      <!-- Loading state -->
      <div v-else-if="isLoading" class="message-loading" aria-live="polite" aria-busy="true">
        <p>Loading your daily message...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="message-error" role="alert">
        <p>{{ error }}</p>
      </div>

      <!-- Author attribution if provided -->
      <p v-if="message?.author" class="message-author">— {{ message.author }}</p>

      <!-- Day counter -->
      <p v-if="dayIndex >= 0 && dayIndex < 365" class="day-counter">
        Day {{ dayIndex + 1 }} of 365
      </p>
    </div>
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
}

.message-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: var(--color-card);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  min-height: 300px;
  text-align: center;
}

.message-text {
  font-size: var(--font-size-xl);
  line-height: var(--line-height-relaxed);
  color: var(--color-text);
  font-weight: 500;
  max-width: 100%;
  word-wrap: break-word;

  /* WCAG AA contrast: 4.5:1+ */
  contrast: 1;
}

.message-author {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  font-style: italic;
  margin-top: var(--spacing-md);
}

.day-counter {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-top: var(--spacing-md);
  margin-bottom: 0;
}

.message-loading,
.message-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.message-loading p {
  color: var(--color-text-light);
}

.message-error {
  background-color: rgba(255, 0, 0, 0.05);
  border-left: 4px solid #ff6b6b;
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}

.message-error p {
  color: #d32f2f;
  font-weight: 500;
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

.message-content {
  animation: fadeIn var(--transition-slow) ease-out;
}

/* Respect reduced-motion preference */
@media (prefers-reduced-motion: reduce) {
  .message-content {
    animation: none;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .message-content {
    padding: var(--spacing-md);
    min-height: 250px;
  }

  .message-text {
    font-size: var(--font-size-lg);
  }
}

/* Mobile small screens */
@media (max-width: 480px) {
  .message-content {
    padding: var(--spacing-sm);
    min-height: 200px;
    gap: var(--spacing-md);
  }

  .message-text {
    font-size: var(--font-size-base);
  }
}
</style>
