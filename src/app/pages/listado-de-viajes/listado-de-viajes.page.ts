import { Component, OnInit } from '@angular/core';
import { RolUsuarioService } from '../../services/rol-usuario.service'; // Servicio de rol de usuario
import { ServicioViajesService } from '../../services/servicio-viajes.service'; // Servicio de viajes
import { ToastController, NavController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore/firestore.service';

@Component({
  selector: 'app-listado-de-viajes',
  templateUrl: './listado-de-viajes.page.html',
  styleUrls: ['./listado-de-viajes.page.scss'],
})
export class ListadoDeViajesPage implements OnInit {
  viajesPendientes: any[] = []; // Arreglo para almacenar los viajes pendientes
  viajesAceptados: any[] = []; // Lista de viajes aceptados para el usuario
  esConductor: boolean = false;
  esPasajero: boolean = false;

  constructor(
    private servicioViajes: ServicioViajesService,
    private rolUsuarioService: RolUsuarioService,
    private toastController: ToastController,
    private navController: NavController,
    private firestoreService: FirestoreService
  ) {}

  async ngOnInit() {
    // Obtener todos los viajes en estado "pendiente"
    this.viajesPendientes = await this.firestoreService.getViajesPendientes();
    console.log('Viajes pendientes encontrados:', this.viajesPendientes);

    // Verificar el rol del usuario
    this.esConductor = this.rolUsuarioService.esConductor();
    this.esPasajero = this.rolUsuarioService.esPasajero();

    // Cargar viajes aceptados si el usuario es conductor
    if (this.esConductor) {
      // Cargar todos los viajes para el conductor
      await this.cargarTodosLosViajes();
    } else if (this.esPasajero) {
      // Cargar solo los viajes pendientes para el pasajero
      await this.cargarViajesPendientes();
    }
  }

  private async cargarTodosLosViajes() {
    this.viajesPendientes = await this.firestoreService.getDocumentsByQuery(
      'viajes',
      'estado',
      'pendiente'
    );

    this.viajesAceptados = await this.firestoreService.getDocumentsByQuery(
      'viajes',
      'estado',
      'aceptado'
    );

    console.log('Viajes pendientes para conductor:', this.viajesPendientes);
    console.log('Viajes aceptados para conductor:', this.viajesAceptados);
  }

  private async cargarViajesPendientes() {
    this.viajesPendientes = await this.firestoreService.getDocumentsByQuery(
      'viajes',
      'estado',
      'pendiente'
    );
    console.log('Viajes pendientes:', this.viajesPendientes);
  }

  private obtenerIdUsuario(): string | null {
    // Implementa aquí la lógica para obtener el ID del usuario logueado
    // Por ejemplo, desde un servicio de autenticación o almacenamiento local
    return 'idUsuario123'; // Reemplazar con la lógica real
  }

  // Función para tomar un viaje (solo para pasajeros)
  // Función para tomar un viaje (solo para pasajeros)
  async tomarViaje(viaje: any) {
    if (!viaje.id) {
      console.warn('El viaje seleccionado no tiene un ID válido.');
      const toast = await this.toastController.create({
        message: 'Error: Este viaje no tiene un ID válido.',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
      return;
    }

    console.log('ID del viaje tomado:', viaje.id);

    // Cambiar el estado del viaje a "aceptado"
    await this.firestoreService.actualizarEstadoViaje(viaje.id, 'aceptado');

    // Actualizar dinámicamente la lista de viajes pendientes
    this.viajesPendientes = this.viajesPendientes.filter(
      (item) => item.id !== viaje.id
    );

    const toast = await this.toastController.create({
      message: 'Has tomado el viaje exitosamente.',
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    await toast.present();

    // Navegar a la página de viaje actual
    this.navController.navigateRoot(`/viaje-actual/${viaje.id}`);
  }

  async terminarViaje(viajeId: string) {
    console.log('ID del viaje recibido para eliminación:', viajeId);

    if (!viajeId) {
      console.error('El ID del viaje no es válido. No se puede eliminar.');
      return;
    }

    try {
      // Llama al servicio Firestore para eliminar el viaje
      await this.firestoreService.eliminarViaje(viajeId);

      console.log(
        `Viaje con ID ${viajeId} eliminado exitosamente de Firestore.`
      );

      // Actualiza dinámicamente las listas locales
      this.viajesPendientes = this.viajesPendientes.filter(
        (viaje) => viaje.id !== viajeId
      );
      console.log(
        'Lista actualizada de viajes pendientes:',
        this.viajesPendientes
      );

      this.viajesAceptados = this.viajesAceptados.filter(
        (viaje) => viaje.id !== viajeId
      );
      console.log(
        'Lista actualizada de viajes aceptados:',
        this.viajesAceptados
      );

      const toast = await this.toastController.create({
        message: 'El viaje ha sido eliminado correctamente.',
        duration: 2000,
        position: 'bottom',
        color: 'success',
      });
      await toast.present();
    } catch (error) {
      console.error(`Error al eliminar el viaje con ID ${viajeId}:`, error);

      const toast = await this.toastController.create({
        message: 'Hubo un error al intentar eliminar el viaje.',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    }
  }
}
