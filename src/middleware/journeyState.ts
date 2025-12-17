import type { RouteLocationNormalized } from 'vue-router';
import { useMessageIndex } from '~/composables/useMessageIndex';

/**
 * Journey state middleware
 * Routes users to the appropriate page based on their journey progress:
 * - Before startDate: coming-soon page
 * - During journey (day 0-364): index page
 * - After journey (day 365+): completed page
 */
export default defineRouteMiddleware(async (to: RouteLocationNormalized) => {
  // Only run client-side
  if (!process.client) return;

  // Skip middleware for specific routes if needed
  const skipPaths = ['/coming-soon', '/completed'];
  if (skipPaths.includes(to.path)) return;

  try {
    const messageIndex = useMessageIndex();

    // Ensure message index is loaded
    if (!messageIndex.currentMessage.value) {
      await messageIndex.refresh();
    }

    const state = messageIndex.state.value;

    // Redirect based on journey state
    if (state === 'COMING_SOON' && to.path !== '/coming-soon') {
      return navigateTo('/coming-soon');
    }

    if (state === 'COMPLETED' && to.path !== '/completed') {
      return navigateTo('/completed');
    }

    // For UNLOCKED state, allow navigation to index or other pages
    if (state === 'UNLOCKED' && (to.path === '/coming-soon' || to.path === '/completed')) {
      return navigateTo('/');
    }
  } catch (error) {
    console.error('Journey state middleware error:', error);
    // On error, allow navigation to proceed (fail open)
  }
});
