import { Injectable } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {
    if (!Capacitor.isNativePlatform()) {
      GoogleAuth.initialize(); // Inicializar explícitamente para web
      console.log('Inicializando GoogleAuth en la web');
    }
  }

  async iniciarSesionConGoogle(): Promise<void> {
    try {
      const user = await GoogleAuth.signIn();
      console.log('Información del usuario:', user);
      // Manejar los datos del usuario aquí
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  }

  async cerrarSesion(): Promise<void> {
    try {
      await GoogleAuth.signOut();
      console.log('Sesión cerrada');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
