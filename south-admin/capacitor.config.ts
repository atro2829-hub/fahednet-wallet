import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.qtbm.south.admin',
  appName: 'محفظة الجنوب - الإدارة',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#4E0A19',
      showSpinner: false,
      fadeOutDuration: 300,
    },
  },
  android: {
    backgroundColor: '#4E0A19',
    allowMixedContent: true,
  },
};

export default config;
