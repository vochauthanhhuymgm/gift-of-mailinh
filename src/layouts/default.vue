<template>
  <v-main>
    <v-container fluid class="d-flex align-center justify-center min-vh-100 py-8">
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8" lg="6">
          <slot />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
// Default layout for all pages
// Minimal chrome using Vuetify grid system to focus on message content
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
}
</style>
