<template>
  <v-app>
    <NightSkyBackground />
    <v-main>
      <v-container fluid class="d-flex align-center justify-center min-vh-100">
        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="6">
            <slot />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import NightSkyBackground from '~/components/NightSkyBackground.vue';
  import Footer from '~/components/Footer.vue';
  // Default layout for all pages
  // Minimal chrome using Vuetify grid system to focus on message content
</script>

<style scoped>
  .min-vh-100 {
    min-height: 100vh;
  }
</style>
