// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'src/',
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/coming-soon', '/completed'],
    },
  },
  // Static generation for Vercel deployment
  nitro: {
    output: {
      publicDir: 'dist',
    },
  },
  // Build configuration for static site
  ssr: true,
  runtimeConfig: {
    public: {
      startDate: process.env.VITE_START_DATE || '2025-12-18',
      appName: process.env.VITE_APP_NAME || 'Daily Life Suggestions',
      unlockedHour: parseInt(process.env.VITE_UNLOCKED_HOUR || '6'),
      unlockedMinute: parseInt(process.env.VITE_UNLOCKED_MINUTE || '0'),
      supportEmail: process.env.VITE_SUPPORT_EMAIL || '',
      privacyPolicy: process.env.VITE_PRIVACY_POLICY || '',
    },
  },
  // TypeScript support
  typescript: {
    strict: false,
    typeCheck: false, // Disable during build to avoid checker issues
  },
  // CSS and styling
  css: [
    '@/assets/styles/global.css',
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
  ],
  // Build optimizations
  build: {
    transpile: ['vuetify'],
  },
})
