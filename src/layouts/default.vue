<template>
  <v-app>
    <NightSkyBackground v-if="!isMorning" />
    <MorningBackground v-if="isMorning" />

    <!-- Header with theme toggle -->
    <v-app-bar position="fixed" class="app-header">
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleMode" :title="isMorning ? 'Switch to Night' : 'Switch to Morning'">
        <v-icon>{{ isMorning ? 'mdi-moon-waning-crescent' : 'mdi-white-balance-sunny' }}</v-icon>
      </v-btn>
    </v-app-bar>

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
import { ref, computed, watch, onMounted } from 'vue';
import NightSkyBackground from '~/components/NightSkyBackground.vue';
import MorningBackground from '~/components/MorningBackground.vue';
import { useBackgroundSound } from '~/composables/useBackgroundSound';

// Manual mode toggle state
const manualMode = ref<'morning' | 'night' | null>(null);

// Determine if it's morning (6 AM - 11:59 AM) or use manual override
const isMorning = computed(() => {
  if (manualMode.value) {
    return manualMode.value === 'morning';
  }
  const hour = new Date().getHours();
  return hour >= 6 && hour < 12;
});

// Sound player (tries file then falls back to a short tone)
const { play: playBackground } = useBackgroundSound();

// Toggle between morning and night modes
const toggleMode = () => {
  manualMode.value = manualMode.value === 'morning' ? 'night' : 'morning';
  playBackground(manualMode.value === 'morning' ? 'morning' : 'night');
};

// Play sound on initial mount and when automatic/time-based mode changes
onMounted(() => {
  playBackground(isMorning.value ? 'morning' : 'night');
});

watch(isMorning, (val, old) => {
  // only play when the effective mode actually changes
  if (val !== old) playBackground(val ? 'morning' : 'night');
});

// Default layout for all pages
// Minimal chrome using Vuetify grid system to focus on message content
</script>

<style scoped>
  header {
    box-shadow: none !important;
  }
  .app-header {
    background-color: transparent;
    box-shadow: none;
  }
</style>

<style scoped>
  .min-vh-100 {
    min-height: 100vh;
  }
</style>
