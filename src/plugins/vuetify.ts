import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Custom calm theme for emotional healing
const calmTheme = {
  dark: false,
  colors: {
    // Primary: Soft purple (calming, spiritual)
    primary: '#7b68ee',
    'primary-darken-1': '#6a5acd',
    'primary-lighten-1': '#9d8ef7',
    
    // Secondary: Soft blue (peaceful, trust)
    secondary: '#89cff0',
    'secondary-darken-1': '#6bb6d9',
    'secondary-lighten-1': '#a8dff7',
    
    // Accent: Warm peach (friendly, approachable)
    accent: '#ffd4a3',
    'accent-darken-1': '#ffc070',
    'accent-lighten-1': '#ffe4c4',
    
    // Neutral backgrounds
    background: '#fafafa',
    surface: '#ffffff',
    
    // Text colors
    'on-primary': '#ffffff',
    'on-secondary': '#000000',
    'on-background': '#2c3e50',
    'on-surface': '#2c3e50',
    
    // Semantic colors (soft, non-alarming)
    error: '#ff6b6b',
    warning: '#ffa726',
    info: '#89cff0',
    success: '#81c784',
  },
};

// Dark mode theme (optional)
const calmDarkTheme = {
  dark: true,
  colors: {
    primary: '#9d8ef7',
    'primary-darken-1': '#7b68ee',
    'primary-lighten-1': '#b5a7ff',
    
    secondary: '#6bb6d9',
    'secondary-darken-1': '#5aa5c8',
    'secondary-lighten-1': '#89cff0',
    
    accent: '#ffc070',
    'accent-darken-1': '#ffb347',
    'accent-lighten-1': '#ffd4a3',
    
    background: '#1a1a1a',
    surface: '#2d2d2d',
    
    'on-primary': '#ffffff',
    'on-secondary': '#000000',
    'on-background': '#e0e0e0',
    'on-surface': '#e0e0e0',
    
    error: '#ff6b6b',
    warning: '#ffa726',
    info: '#89cff0',
    success: '#81c784',
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'calmLight',
      themes: {
        calmLight: calmTheme,
        calmDark: calmDarkTheme,
      },
      variations: {
        colors: ['primary', 'secondary', 'accent'],
        lighten: 3,
        darken: 3,
      },
    },
    defaults: {
      VBtn: {
        variant: 'flat',
        rounded: 'lg',
        elevation: 0,
      },
      VCard: {
        variant: 'elevated',
        rounded: 'lg',
        elevation: 2,
      },
      VTextField: {
        variant: 'outlined',
        rounded: 'lg',
      },
      VAlert: {
        variant: 'tonal',
        rounded: 'lg',
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
