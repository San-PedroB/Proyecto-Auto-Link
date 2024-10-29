import { Component, OnInit } from '@angular/core';
import { RolUsuarioService } from '../../services/rol-usuario.service'; // Servicio de rol de usuario
import { ServicioViajesService } from '../../services/servicio-viajes.service'; // Servicio de viajes
import { ToastController, NavController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { GuardarCorreoService } from 'src/app/services/guardar-correo.service';

@Component({
  selector: 'app-listado-de-viajes',
  templateUrl: './listado-de-viajes.page.html',
  styleUrls: ['./listado-de-viajes.page.scss'],
})
export class ListadoDeViajesPage implements OnInit {
  viajesPendientes: any[] = []; // Arreglo para almacenar los viajes pendientes
  viajesAceptados: any[] = []; // Lista de viajes aceptados para el conductor
  esConductor: boolean = false;
  esPasajero: boolean = false;

  constructor(
    private servicioViajes: ServicioViajesService,
    private rolUsuarioService: RolUsuarioService,
    private toastController: ToastController,
    private navController: NavController,
    private firestoreService: FirestoreService,
    private guardarCorreoService: GuardarCorreoService
  ) {}

  async ngOnInit() {
    // Obtener todos los viajes que están en estado 'pendiente'
    this.viajesPendientes = await this.firestoreService.getPendingViajes(
      'viajes'
    );
    console.log('Viajes pendientes encontrados:', this.viajesPendientes);

    // Verificar si el usuario es conductor o pasajero
    this.esConductor = this.rolUsuarioService.esConductor();
    this.esPasajero = this.rolUsuarioService.esPasajero();

    // Cargar viajes aceptados si el usuario es conductor
    if (this.esConductor) {
      const correoConductor = this.guardarCorreoService.getCorreoUsuario();
      if (correoConductor) {
        this.viajesAceptados =
          await this.firestoreService.obtenerViajesAceptados(correoConductor);
        console.log('Viajes aceptados encontrados:', this.viajesAceptados);
      } else {
        console.warn('No se encontró el correo del conductor logueado.');
      }
    }
  }

  // Función para tomar el viaje (solo para pasajeros)
  async tomarViaje(viaje: any) {
    // Guardar el viaje en el servicio para que esté disponible en `viaje-actual`
    this.servicioViajes.setDatos(viaje);

    // Cambiar el estado del viaje a "aceptado" en Firestore
    await this.firestoreService.actualizarEstadoViajePorCorreo(
      viaje.conductorCorreo,
      'aceptado'
    );

    // Navegar a la página `viaje-actual`
    this.navController.navigateRoot('/viaje-actual');
  }

  // Función para terminar el viaje y eliminarlo de Firebase
  async terminarViaje(correoConductor: string) {
    console.log(
      'Correo del conductor para eliminar el viaje:',
      correoConductor
    );

    // Elimina el viaje individualmente de Firestore basado en el correo del conductor
    await this.firestoreService.eliminarViaje(correoConductor);

    const toast = await this.toastController.create({
      message: 'El viaje ha sido eliminado.',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();

    // Actualiza la lista local de viajes pendientes
    this.viajesPendientes = this.viajesPendientes.filter(
      (viaje) => viaje.conductorCorreo !== correoConductor
    );
  }
}
