import { Component, OnInit } from '@angular/core';
import { ServicioViajesService } from '../../services/servicio-viajes.service';
import { ToastController, NavController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

@Component({
  selector: 'app-viaje-actual',
  templateUrl: './viaje-actual.page.html',
  styleUrls: ['./viaje-actual.page.scss'],
})
export class ViajeActualPage implements OnInit {
  viajeActual: any = null;
  botonHabilitado: boolean = true;
  tiempoRestante: number = 10; // Temporizador de 10 segundos

  constructor(
    private servicioViajes: ServicioViajesService,
    private toastController: ToastController,
    private navController: NavController,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    // Obtener el viaje actual desde el servicio y verificar si tiene datos válidos
    this.viajeActual = this.servicioViajes.getDatos();

    if (!this.viajeActual) {
      // Mostrar advertencia si no hay datos y redirigir al listado de viajes
      console.warn('No se encontraron datos para el viaje actual.');
      this.mostrarMensaje('No hay información del viaje actual');
      this.navController.navigateRoot('/listado-de-viajes');
      return;
    }

    // Iniciar temporizador solo si hay datos en `viajeActual`
    this.iniciarTemporizador();
  }

  // Método para mostrar un mensaje con ToastController
  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      color: 'warning',
    });
    await toast.present();
  }

  // Iniciar temporizador regresivo
  iniciarTemporizador() {
    const intervalo = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante === 0) {
        this.botonHabilitado = false; // Deshabilitar el botón
        clearInterval(intervalo); // Detener el temporizador
      }
    }, 1000); // Actualizar cada segundo
  }

  // Método para cancelar el viaje
  async cancelarViaje() {
    if (this.botonHabilitado) {
      console.log('Cancelando el viaje...');

      // Cambiar el estado del viaje a "pendiente" en Firestore
      const correoConductor = this.viajeActual.conductorCorreo;
      await this.firestoreService.actualizarEstadoViajePorCorreo(
        correoConductor,
        'pendiente'
      );

      await this.mostrarMensaje('Viaje cancelado exitosamente');
    }

    // Navegar de regreso al listado de viajes
    this.navController.navigateRoot('/listado-de-viajes');
  }
}
