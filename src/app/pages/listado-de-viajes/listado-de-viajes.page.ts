import { Component, OnInit } from '@angular/core';
import { RolUsuarioService } from '../../services/rol-usuario.service'; // Servicio de rol de usuario
import { ServicioViajesService } from '../../services/servicio-viajes.service'; // Servicio de viajes
import { ToastController } from '@ionic/angular'; // Para mostrar mensajes Toast
import { NavController } from '@ionic/angular';
import { FirestoreService } from '../../services/firestore/firestore.service';

@Component({
  selector: 'app-listado-de-viajes',
  templateUrl: './listado-de-viajes.page.html',
  styleUrls: ['./listado-de-viajes.page.scss'],
})
export class ListadoDeViajesPage implements OnInit {
  viajeEnCurso: any = null;
  esConductor: boolean = false;
  esPasajero: boolean = false;
  viajeActivo: boolean = false;

  constructor(
    private servicioViajes: ServicioViajesService,
    private rolUsuarioService: RolUsuarioService,
    private toastController: ToastController,
    private navController: NavController,
    private firestoreService: FirestoreService
  ) {}

  async ngOnInit() {
    // Obtener los datos del viaje desde el servicio
    try {
      // Usa `await` para esperar la resolución del `Promise`
      this.viajeEnCurso = await this.firestoreService.getDocumentByQuery(
        'viajes',
        'estado',
        'pendiente'
      );
      console.log('Viaje:', this.viajeEnCurso);
    } catch (error) {
      console.error('Error al obtener los datos del viaje:', error);
    }

    // Verificar si el usuario es conductor o pasajero
    this.esConductor = this.rolUsuarioService.esConductor();
    this.esPasajero = this.rolUsuarioService.esPasajero();
    console.log('esConductor:', this.esConductor); // Verificar el rol de conductor
    console.log('esPasajero:', this.esPasajero); // Verificar el rol de pasajero
  }

  // Función para tomar el viaje (solo para pasajeros)
  async tomarViaje() {
    //cambiar estado de viaje a activo
    this.viajeActivo = true;
    this.navController.navigateRoot('/viaje-actual');
  }

  // Función para terminar el viaje
  async terminarViaje() {
    // Terminar el viaje usando el servicio
    this.servicioViajes.borrarViaje();

    // Actualizar la vista para reflejar que no hay viaje en curso
    this.viajeEnCurso = null;
    this.viajeActivo = false; // Cambiar el estado del viaje a inactivo

    // Muestra un mensaje de confirmación
    const toast = await this.toastController.create({
      message: 'El viaje ha sido terminado.',
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }
}
