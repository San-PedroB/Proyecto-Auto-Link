import { Component, OnInit } from '@angular/core';
import { RolUsuarioService } from '../../services/rol-usuario.service'; // Servicio de rol de usuario
import { ServicioViajesService } from '../../services/servicio-viajes.service'; // Servicio de viajes
import { ToastController } from '@ionic/angular'; // Para mostrar mensajes Toast
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-viaje-actual',
  templateUrl: './viaje-actual.page.html',
  styleUrls: ['./viaje-actual.page.scss'],
})
export class ViajeActualPage implements OnInit {
  viajeActual: any = null;
  esConductor: boolean = false;
  esPasajero: boolean = false;
  botonHabilitado: boolean = true;
  tiempoRestante: number = 10; // 10 segundos de cuenta regresiva
  viajeAceptado: boolean = false;

  constructor(
    private servicioViajes: ServicioViajesService,
    private rolUsuarioService: RolUsuarioService,
    private toastController: ToastController,
    private navController: NavController
  ) {}

  ngOnInit() {
    // Obtener los datos del viaje desde el servicio
    this.viajeActual = this.servicioViajes.getDatos();
    console.log('Viaje:', this.viajeActual);

    // Iniciar temporizador regresivo
    const intervalo = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante === 0) {
        this.botonHabilitado = false; // Deshabilitar el botón
        clearInterval(intervalo); // Detener el temporizador
      }
    }, 1000); // Actualizar cada segundo
  }

  async cancelarViaje() {
    if (this.botonHabilitado) {
      console.log('Viaje cancelado');
      const toast = await this.toastController.create({
        message: 'Viaje cancelado exitosamente',
        duration: 2000,
        position: 'top',
        color: 'success',
      });
      await toast.present();
    }
    this.navController.navigateRoot('/listado-de-viajes');
  }
}
