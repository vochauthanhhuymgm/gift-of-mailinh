import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

// Define the custom dark theme
const calmTheme = {
  dark: true, // Set dark theme as default
  colors: {
    background: '#111827', // Dark Navy-Gray, matches body background
    surface: '#1f2937', // Dark Slate for cards
    primary: '#9b8afb', // Soft Lavender from global.css
    'primary-darken-1': '#8170e8',
    secondary: '#79dcf1', // Gentle Cyan from global.css
    'secondary-darken-1': '#59cde8',
    error: '#ff5252',
    info: '#2196f3',
    success: '#4caf50',
    warning: '#ffc107',
    // Text colors for readability on dark surfaces
    'on-background': '#eef2f5', // Off-white from global.css
    'on-surface': '#ffffff',
    'on-primary': '#ffffff',
    'on-secondary': '#111827', // Dark text for better contrast on the light secondary color
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'calmTheme', // Use the custom theme
      themes: {
        calmTheme,
      },
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    display: {
      mobileBreakpoint: 'sm',
      thresholds: {
        xs: 0,
        sm: 480,
        md: 768,
        lg: 1024,
        xl: 1280,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
