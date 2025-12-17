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
    background: '#1a1a2e', // Dark blue-purple from global.css
    surface: '#2c2c44', // A slightly lighter surface for cards/dialogs
    primary: '#8e7dff', // Bright lavender from global.css
    'primary-darken-1': '#7a6ad9',
    secondary: '#c651cd', // Orchid from global.css
    'secondary-darken-1': '#ab47b2',
    error: '#ff5252',
    info: '#2196f3',
    success: '#4caf50',
    warning: '#ffc107',
    // Text colors for readability on dark surfaces
    'on-background': '#e0e0e0',
    'on-surface': '#ffffff',
    'on-primary': '#ffffff',
    'on-secondary': '#ffffff',
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
