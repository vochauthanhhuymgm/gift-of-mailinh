<template>
  <div class="coming-soon-wrapper">
    <div class="coming-soon-container">
      <h1 class="coming-soon-title">Get Ready</h1>
      <p class="coming-soon-subtitle">Your 365-day emotional healing journey is coming</p>

      <div class="coming-soon-date-section">
        <p class="coming-soon-date-label">Starting:</p>
        <p class="coming-soon-date">{{ startDate }}</p>
        <p class="coming-soon-time">at 6:00 AM local time</p>
      </div>

      <p class="coming-soon-description">
        Prepare yourself for a year of daily inspiration, encouragement, and emotional support. This journey is designed to help you start each day with calm, warmth, and purpose.
      </p>

      <div class="coming-soon-features">
        <h2>What to Expect</h2>
        <ul>
          <li>One daily message unlocked each morning at 6:00 AM</li>
          <li>365 carefully curated suggestions for emotional healing</li>
          <li>A calm, distraction-free experience</li>
          <li>Completely private—no data collection</li>
          <li>Offline-capable after first load</li>
        </ul>
      </div>

      <p class="coming-soon-cta">Save this page to start your journey on day one.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDateLock } from '~/composables/useDateLock';
import { formatDateISO } from '~/utils/dateCalculation';

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

useHead({
  title: 'Coming Soon - Daily Life Suggestions',
  meta: [
    {
      name: 'description',
      content: 'Your 365-day emotional healing journey is coming soon. Get ready to start your daily practice.',
    },
  ],
});
</script>

<style scoped>
.coming-soon-wrapper {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: linear-gradient(
    135deg,
    var(--color-background) 0%,
    var(--color-card) 100%
  );
}

.coming-soon-container {
  width: 100%;
  max-width: 600px;
  background-color: var(--color-card);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.coming-soon-title {
  font-size: var(--font-size-3xl);
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  font-weight: 600;
}

.coming-soon-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text);
  margin-bottom: var(--spacing-xl);
  font-weight: 500;
}

.coming-soon-date-section {
  background-color: var(--color-border);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-xl);
}

.coming-soon-date-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.coming-soon-date {
  font-size: var(--font-size-2xl);
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.coming-soon-time {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.coming-soon-description {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-text);
  margin-bottom: var(--spacing-xl);
}

.coming-soon-features {
  text-align: left;
  margin-bottom: var(--spacing-xl);
}

.coming-soon-features h2 {
  font-size: var(--font-size-lg);
  color: var(--color-text);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.coming-soon-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.coming-soon-features li {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  padding: var(--spacing-sm) 0;
  padding-left: var(--spacing-lg);
  position: relative;
  margin-bottom: var(--spacing-sm);
  line-height: var(--line-height-relaxed);
}

.coming-soon-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: 600;
}

.coming-soon-cta {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  font-style: italic;
}

/* Animation */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.coming-soon-container {
  animation: slideInUp var(--transition-slow) ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .coming-soon-container {
    animation: none;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .coming-soon-wrapper {
    padding: var(--spacing-md);
  }

  .coming-soon-container {
    padding: var(--spacing-lg);
  }

  .coming-soon-title {
    font-size: var(--font-size-2xl);
  }

  .coming-soon-date {
    font-size: var(--font-size-xl);
  }
}
</style>
