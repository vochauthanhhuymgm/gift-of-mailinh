<template>
  <v-app>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<script setup lang="ts">
  // Root app component for Daily Life-Healing Suggestions
  // Uses Vuetify VApp wrapper for theming and layout
</script>

<style>
  html {
    scroll-behavior: smooth;
  }
</style>
