import { Component, OnInit } from '@angular/core';
import { RolUsuarioService } from '../../services/rol-usuario.service'; // Servicio de rol de usuario
import { ServicioViajesService } from '../../services/servicio-viajes.service'; // Servicio de viajes
import { ToastController } from '@ionic/angular'; // Para mostrar mensajes Toast

@Component({
  selector: 'app-viajes-en-curso',
  templateUrl: './viajes-en-curso.page.html',
  styleUrls: ['./viajes-en-curso.page.scss'],
})
export class ViajesEnCursoPage implements OnInit {

  viajeEnCurso: any = null;
  esConductor: boolean = false;
  esPasajero: boolean = false;
  viajeActivo: boolean = false;

  constructor(private servicioViajes: ServicioViajesService, private rolUsuarioService: RolUsuarioService, private toastController: ToastController) { }

  ngOnInit() {
    // Obtener los datos del viaje desde el servicio
    this.viajeEnCurso = this.servicioViajes.getDatos();
    console.log('Viaje:', this.viajeEnCurso);

    // Verificar si el usuario es conductor o pasajero
    this.esConductor = this.rolUsuarioService.esConductor();
    this.esPasajero = this.rolUsuarioService.esPasajero();
    console.log('esConductor:', this.esConductor);  // Verificar el rol de conductor
    console.log('esPasajero:', this.esPasajero);  // Verificar el rol de pasajero
  }

  // Función para tomar el viaje (solo para pasajeros)
  async tomarViaje() {
    //logica que cambiara valor de viajeActivo para que pasajero no pueda volver a tomar un viaje si no ha terminado su viaje
    if(this.viajeActivo === true){
      const toast = await this.toastController.create({
        message: 'Tienes un viaje activo, no puedes iniciar otro hasta que finalice',
        duration: 3000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();
      return;
    }
    //cambiar estado de viaje a activo
    this.viajeActivo = true;
    const toast = await this.toastController.create({
      message: 'Has tomado el viaje.',
      duration: 2000,
      position: 'top'
    });
    await toast.present();
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
      position: 'top'
    });
    await toast.present();
  }
}
