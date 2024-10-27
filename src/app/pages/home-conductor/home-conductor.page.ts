import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
import { Router } from '@angular/router';
import { FormularioService } from '../../services/formulario.service'; // Importar el servicio formulario
import { ServicioViajesService } from 'src/app/services/servicio-viajes.service'; // Importar servicio de viajes

@Component({
  selector: 'app-home-conductor',
  templateUrl: './home-conductor.page.html',
  styleUrls: ['./home-conductor.page.scss'],
})
export class HomeConductorPage implements OnInit {
  datosFormulario: any = {};

  constructor(
    private modalController: ModalController,
    private router: Router,
    private toastController: ToastController,
    private formularioService: FormularioService,
    private servicioViajes: ServicioViajesService
  ) {}

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  async abrirModal() {
    const modal = await this.modalController.create({
      component: ModalLoginComponent,
    });
    return await modal.present();
  }

  ngOnInit() {
    this.datosFormulario = this.formularioService.getDatos();
    // Verificar si los datos se cargan correctamente
    console.log('Datos del usuario:', this.datosFormulario);
  }

  async verificarEstadoViaje() {
    if (this.servicioViajes.isViajeCreado()) {
      // Mostrar mensaje si hay un viaje en curso
      const toast = await this.toastController.create({
        message: 'Ya tienes un viaje en curso.',
        duration: 3000,
        position: 'top',
        color: 'warning',
      });
      await toast.present();
      return;
    }
    this.abirVentanaCrearViaje();
  }

  async abirVentanaCrearViaje() {
    this.router.navigate(['/crear-viaje']);
  }
}
