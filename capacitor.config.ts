import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cl.duoc.autolink', // Tu applicationId de Firebase
  appName: 'Auto Link',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'], // Solicita acceso al perfil y correo del usuario
      serverClientId:
        '958787886695-f924mdomkdebiq2ttk81kuc1ceefl2rj.apps.googleusercontent.com',
      forceCodeForRefreshToken: true, // Para obtener tokens de actualización
    },
  },
};

export default config;
