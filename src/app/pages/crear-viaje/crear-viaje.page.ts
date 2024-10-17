import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ServicioViajesService } from '../../services/servicio-viajes.service'; // Importa el servicio de viajes
import { ToastController, NavController } from '@ionic/angular'; // Para mostrar mensajes Toast

@Component({
  selector: 'app-crear-viaje',
  templateUrl: './crear-viaje.page.html',
  styleUrls: ['./crear-viaje.page.scss'],
})
export class CrearViajePage implements OnInit {

  formularioViaje: FormGroup;

  constructor(
    private servicioViajes: ServicioViajesService,
    public fb: FormBuilder,
    private toastController: ToastController,
    private navController: NavController
    ) {
    this.formularioViaje = this.fb.group({
      "origen": new FormControl("", Validators.required),
      "destino": new FormControl("", Validators.required),
      "precio": new FormControl("", Validators.required)
    });
  }

  async crearViaje() {
    if (this.formularioViaje.invalid) {
      const toastError = await this.toastController.create({
        message: "Por favor completa correctamente todos los campos", 
        duration: 3000,
        position: 'bottom'
      });
      await toastError.present();
      return;
    }
    this.enviarFormularioViaje();
    this.navController.navigateRoot('/viajes-en-curso');
  }

  async enviarFormularioViaje() {
    if (this.formularioViaje.valid) {
      this.servicioViajes.setDatos(this.formularioViaje);
    }
  }

  // Llamar a la función del servicio para terminar el viaje y borrar los datos del formulario
  async terminarViaje() {
    this.servicioViajes.terminarViaje(this.formularioViaje);

    const toast = await this.toastController.create({
      message: 'El viaje ha sido terminado.',
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }

  ngOnInit() {}
}
