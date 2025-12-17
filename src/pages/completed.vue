<template>
  <div class="completed-wrapper">
    <div class="completed-container">
      <h1 class="completed-title">Journey Complete</h1>

      <div class="completion-message">
        <p class="completion-text">
          You've completed your 365-day emotional healing journey.
        </p>
        <p class="completion-celebration">🌟</p>
      </div>

      <div class="completion-dates">
        <p class="completion-date-item">
          <span class="date-label">Started:</span>
          <span class="date-value">{{ startDate }}</span>
        </p>
        <p class="completion-date-item">
          <span class="date-label">Completed:</span>
          <span class="date-value">{{ completionDate }}</span>
        </p>
      </div>

      <div class="completion-reflection">
        <h2>Thank You</h2>
        <p>
          Thank you for dedicating 365 days to your emotional healing and personal growth. You've shown remarkable commitment to self-care and mindfulness.
        </p>
        <p>
          Remember, healing is not a destination but a continuous practice. Continue to be kind to yourself, honor your feelings, and nurture your well-being.
        </p>
      </div>

      <div class="completion-next-steps">
        <h2>What's Next?</h2>
        <ul>
          <li>Reflect on your growth and insights from this journey</li>
          <li>Consider how you can continue supporting your emotional well-being</li>
          <li>Share this experience with others who might benefit</li>
          <li>Revisit your favorite messages whenever you need encouragement</li>
        </ul>
      </div>

      <p class="completion-closing">
        With gratitude for your presence and commitment to yourself.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDateLock } from '~/composables/useDateLock';

const dateLock = useDateLock();

const startDate = computed(() => {
  const date = dateLock.getStartDate();
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
});

const completionDate = computed(() => {
  const date = dateLock.getCompletionDate();
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
});

useHead({
  title: 'Journey Complete - Daily Life Suggestions',
  meta: [
    {
      name: 'description',
      content: 'Congratulations on completing your 365-day emotional healing journey.',
    },
  ],
});
</script>

<style scoped>
.completed-wrapper {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: linear-gradient(
    135deg,
    var(--color-secondary) 0%,
    var(--color-accent) 100%
  );
}

.completed-container {
  width: 100%;
  max-width: 700px;
  background-color: var(--color-card);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.completed-title {
  font-size: var(--font-size-3xl);
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
  font-weight: 600;
}

.completion-message {
  margin-bottom: var(--spacing-xl);
}

.completion-text {
  font-size: var(--font-size-xl);
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
  line-height: var(--line-height-relaxed);
}

.completion-celebration {
  font-size: 3rem;
  margin: var(--spacing-lg) 0;
  animation: float var(--transition-slow) ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .completion-celebration {
    animation: none;
  }
}

.completion-dates {
  background-color: var(--color-border);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.completion-date-item {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-base);
  color: var(--color-text);
}

.date-label {
  font-weight: 600;
  color: var(--color-primary);
}

.date-value {
  color: var(--color-text);
}

.completion-reflection,
.completion-next-steps {
  text-align: left;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: rgba(123, 104, 238, 0.05);
  border-left: 4px solid var(--color-primary);
  border-radius: var(--border-radius-md);
}

.completion-reflection h2,
.completion-next-steps h2 {
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.completion-reflection p,
.completion-next-steps p {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-md);
}

.completion-reflection p:last-child,
.completion-next-steps p:last-child {
  margin-bottom: 0;
}

.completion-next-steps ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.completion-next-steps li {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  padding: var(--spacing-sm) 0 var(--spacing-sm) var(--spacing-lg);
  position: relative;
  margin-bottom: var(--spacing-sm);
  line-height: var(--line-height-relaxed);
}

.completion-next-steps li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: 600;
}

.completion-closing {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  font-style: italic;
  margin: 0;
}

/* Animation */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.completed-container {
  animation: fadeInDown var(--transition-slow) ease-out;
}

/* Responsive */
@media (max-width: 768px) {
  .completed-wrapper {
    padding: var(--spacing-md);
  }

  .completed-container {
    padding: var(--spacing-lg);
  }

  .completed-title {
    font-size: var(--font-size-2xl);
  }

  .completion-text {
    font-size: var(--font-size-lg);
  }

  .completion-celebration {
    font-size: 2rem;
  }
}
</style>
