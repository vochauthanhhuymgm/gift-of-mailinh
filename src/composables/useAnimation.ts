/**
 * useAnimation Composable
 * Provides animation utilities respecting prefers-reduced-motion preference
 * Ensures all animations are ≥500ms for gentle, perceivable motion
 */

import { computed, ref, onMounted } from 'vue';
import { appConfig } from '~/config';

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion(): boolean {
  if (!process.client) return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Create animation options respecting user preferences
 */
export function createAnimationOptions() {
  const reducedMotion = ref(prefersReducedMotion());

  // Listen for changes to prefers-reduced-motion
  if (process.client) {
    onMounted(() => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleChange = (e: MediaQueryListEvent) => {
        reducedMotion.value = e.matches;
      };

      // Modern browsers use addEventListener
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      }

      // Fallback for older browsers
      if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
      }
    });
  }

  return reducedMotion;
}

/**
 * Get animation duration based on preferences
 */
export function getAnimationDuration(): number {
  return prefersReducedMotion()
    ? appConfig.ANIMATION_DURATION_REDUCED_MOTION_MS
    : appConfig.ANIMATION_DURATION_MS;
}

/**
 * Animation names and durations (all ≥500ms per spec)
 */
export const animations = {
  fadeIn: {
    name: 'fadeIn',
    duration: appConfig.ANIMATION_DURATION_MS,
  },
  slideUp: {
    name: 'slideUp',
    duration: appConfig.ANIMATION_DURATION_MS,
  },
  slideDown: {
    name: 'slideDown',
    duration: appConfig.ANIMATION_DURATION_MS,
  },
  scaleIn: {
    name: 'scaleIn',
    duration: appConfig.ANIMATION_DURATION_MS,
  },
  pulse: {
    name: 'pulse',
    duration: appConfig.ANIMATION_DURATION_MS * 2, // Slower pulse
  },
};

/**
 * Composable for animations
 */
export function useAnimation() {
  const reducedMotion = createAnimationOptions();

  const getDuration = computed(() => {
    return reducedMotion.value
      ? appConfig.ANIMATION_DURATION_REDUCED_MOTION_MS
      : appConfig.ANIMATION_DURATION_MS;
  });

  const getTransition = computed(() => {
    if (reducedMotion.value) {
      return 'none';
    }
    return `all ${appConfig.ANIMATION_DURATION_MS}ms ease-out`;
  });

  const isAnimationEnabled = computed(() => !reducedMotion.value);

  return {
    reducedMotion: computed(() => reducedMotion.value),
    getDuration,
    getTransition,
    isAnimationEnabled,
    animations,
  };
}

/**
 * Apply fade-in animation
 */
export function withFadeIn(element: HTMLElement, duration: number = appConfig.ANIMATION_DURATION_MS) {
  if (!element) return;

  element.style.opacity = '0';
  element.style.transition = `opacity ${duration}ms ease-out`;

  // Trigger animation in next frame
  requestAnimationFrame(() => {
    element.style.opacity = '1';
  });
}

/**
 * Apply slide-up animation
 */
export function withSlideUp(element: HTMLElement, distance: number = 20, duration: number = appConfig.ANIMATION_DURATION_MS) {
  if (!element) return;

  element.style.opacity = '0';
  element.style.transform = `translateY(${distance}px)`;
  element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;

  // Trigger animation in next frame
  requestAnimationFrame(() => {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  });
}

/**
 * Delay a function until animation completes
 */
export function delayUntilAnimationEnd(duration: number = appConfig.ANIMATION_DURATION_MS): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration + 50); // Add 50ms buffer
  });
}
