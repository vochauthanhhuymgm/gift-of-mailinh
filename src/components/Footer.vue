<template>
  <v-footer app absolute class="text-center d-flex flex-column pa-4" style="background-color: transparent;">
    <div>
      <v-btn
        v-for="icon in icons"
        :key="icon.name"
        class="mx-4"
        :icon="icon.mdi"
        variant="text"
        :href="icon.link"
        target="_blank"
        :aria-label="icon.name"
      ></v-btn>
    </div>

    <div class="pt-4 text-caption" style="color: rgba(255, 255, 255, 0.7);">
      {{ new Date().getFullYear() }} — <strong>{{ appName }}</strong>
    </div>

    <v-divider></v-divider>

    <div class="pt-4 text-caption" style="color: rgba(255, 255, 255, 0.5);">
      <a :href="privacyPolicyUrl" class="footer-link mx-2">Privacy Policy</a>
      <span v-if="supportEmail">|</span>
      <a v-if="supportEmail" :href="`mailto:${supportEmail}`" class="footer-link mx-2">Contact Support</a>
    </div>
  </v-footer>
</template>

<script setup>
import { ref, computed } from 'vue';

const config = useRuntimeConfig();

const appName = ref(config.public.appName);
const supportEmail = ref(config.public.supportEmail);
const privacyPolicyUrl = ref(config.public.privacyPolicy);

const icons = ref([
  { name: 'GitHub', mdi: 'mdi-github', link: 'https://github.com/your-repo' }, // Replace with your link
  // Add other social links here if needed
]);
</script>

<style scoped>
.footer-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: rgba(255, 255, 255, 1);
  text-decoration: underline;
}
</style>
