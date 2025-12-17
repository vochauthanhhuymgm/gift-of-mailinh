<template>
  <div class="default-layout">
    <main class="layout-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
// Default layout for all pages
// Minimal chrome to focus on message content
</script>

<style scoped>
.default-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  background-color: var(--color-background);
}

.layout-content {
  width: 100%;
  max-width: 600px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .default-layout {
    padding: var(--spacing-sm);
  }
}
</style>
