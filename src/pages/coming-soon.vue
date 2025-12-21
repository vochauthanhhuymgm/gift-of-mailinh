<template>
  <div class="coming-soon-wrapper">
    <div class="coming-soon-container">
      <h1 class="coming-soon-title">A Gift for You - Mai Linh</h1>
      <p class="coming-soon-subtitle">
        A 365-day journey of gentle reminders, made with you in mind.
      </p>

      <div class="coming-soon-date-section">
        <p class="coming-soon-date-label">It all begins:</p>
        <p class="coming-soon-date">{{ startDate }}</p>
        <p class="coming-soon-time">at 6:00 AM local time</p>
      </div>

      <p class="coming-soon-description">
        I wanted to create something special, just for you. A small, quiet space for a moment of
        peace and reflection each day. I hope it brings a little bit of warmth and a smile to your
        face.
      </p>

      <p class="coming-soon-cta">I can't wait for you to see it.</p>
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
</script>

<style scoped>
  .coming-soon-wrapper {
    width: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-lg);
    background: transparent;
  }

  .coming-soon-container {
    width: 100%;
    max-width: 700px; /* Increased max-width for better layout */
    position: relative;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: var(--spacing-xl);
    border-radius: 1.5rem !important; /* Match MessageDisplay */
    box-shadow: 0 25px 70px rgba(3, 5, 9, 0.65);
    text-align: center;
    overflow: hidden; /* To contain the ::before pseudo-element */
    padding: 1rem 2rem;
    max-width: 90vw;
  }

  .coming-soon-container::before {
    content: '';
    position: absolute;
    inset: -40px -20px auto -20px;
    height: 65%;
    background: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.2), transparent 70%);
    pointer-events: none;
    opacity: 0.9;
  }

  .coming-soon-title {
    font-family: var(--font-family-serif);
    font-size: clamp(2rem, 4vw, 3rem);
    color: #f7fbff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
    margin-bottom: var(--spacing-md);
    font-weight: 600;
  }

  .coming-soon-subtitle {
    font-size: var(--font-size-lg);
    color: #e0e7ff;
    margin-bottom: var(--spacing-xl);
    font-weight: 400;
  }

  .coming-soon-date-section {
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }

  /* .coming-soon-date-label {
  font-size: var(--font-size-sm);
  color: rgba(212, 175, 55, 0.8);
  margin-bottom: var(--spacing-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
} */

  .coming-soon-date {
    font-size: var(--font-size-2xl);
    color: #d4af37; /* Gold color */
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
    text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
  }

  .coming-soon-time {
    font-size: var(--font-size-sm);
    color: #e0e7ff;
  }

  .coming-soon-description {
    font-size: var(--font-size-base);
    line-height: var(--line-height-relaxed);
    color: #e0e7ff;
    margin-bottom: var(--spacing-xl);
  }

  .coming-soon-features {
    text-align: left;
    margin-bottom: var(--spacing-xl);
  }

  .coming-soon-features h2 {
    font-size: var(--font-size-lg);
    color: #f7fbff;
    margin-bottom: var(--spacing-md);
    text-align: center;
    font-weight: 500;
  }

  .coming-soon-features ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: inline-block; /* Center the list block */
    text-align: left;
  }

  .coming-soon-features li {
    font-size: var(--font-size-sm);
    color: #e0e7ff;
    padding: var(--spacing-sm) 0;
    padding-left: var(--spacing-lg);
    position: relative;
    margin-bottom: var(--spacing-sm);
    line-height: var(--line-height-relaxed);
  }

  .coming-soon-features li::before {
    content: '✦'; /* Changed from checkmark to a star */
    position: absolute;
    left: 0;
    color: #d4af37; /* Gold color */
    font-weight: 600;
    text-shadow: 0 0 8px rgba(212, 175, 55, 0.7);
  }

  .coming-soon-cta {
    font-size: var(--font-size-base); /* Larger CTA */
    color: #f7fbff;
    font-style: italic;
    font-family: var(--font-family-serif);
    letter-spacing: 0.05em;
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
      position: absolute;
      top: 13%;
      padding: 1rem 2rem;
    }

    .coming-soon-title {
      font-size: var(--font-size-2xl);
    }

    .coming-soon-date {
      font-size: var(--font-size-xl);
    }
  }
</style>
