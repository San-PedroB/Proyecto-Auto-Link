import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ToastController, NavController } from '@ionic/angular';

import { ServicioViajesService } from '../../services/servicio-viajes.service'; // Importa el servicio de viajes
import { FirestoreService } from '../../services/firestore/firestore.service';

@Component({
  selector: 'app-crear-viaje',
  templateUrl: './crear-viaje.page.html',
  styleUrls: ['./crear-viaje.page.scss'],
})
export class CrearViajePage implements OnInit {
  formularioViaje: FormGroup;
  numeroPasajeros: number = 0;
  viajeEnCurso: boolean = false;

  constructor(
    private servicioViajes: ServicioViajesService,
    private toastController: ToastController,
    private navController: NavController,
    private formBuilder: FormBuilder,
    private firestoreService: FirestoreService
  ) {
    this.formularioViaje = this.formBuilder.group({
      origen: new FormControl('', Validators.required),
      destino: new FormControl('', Validators.required),
      precio: new FormControl('', Validators.required),
      cantidadPasajeros: new FormControl(1, Validators.required),
      estado: new FormControl('pendiente'),
    });
  }

  async crearViaje() {
    if (this.formularioViaje.invalid) {
      const toastError = await this.toastController.create({
        message: 'Por favor completa correctamente todos los campos',
        duration: 3000,
        position: 'bottom',
        color: 'warning',
      });
      await toastError.present();
      return;
    }
    this.viajeEnCurso = true;
    this.enviarFormularioViaje();
    this.obtenerCantidadPasajeros();
    console.log(this.formularioViaje.value);
    console.log('Viaje creado');
    this.navController.navigateRoot('/listado-de-viajes');
  }

  async obtenerCantidadPasajeros() {
    const datosViaje = this.servicioViajes.getDatos();
    if (datosViaje && datosViaje.cantidadPasajeros !== undefined) {
      this.numeroPasajeros = datosViaje.cantidadPasajeros;
    }
    console.log('Número de pasajeros:', this.numeroPasajeros);
  }

  async enviarFormularioViaje() {
    if (this.formularioViaje.valid) {
      await this.firestoreService.createDocument(
        'viajes', //nombre de la coleccion
        this.formularioViaje.value
      );
    }
  }

  // Llamar a la función del servicio para terminar el viaje y borrar los datos del formulario
  async terminarViaje() {
    this.servicioViajes.terminarViaje(this.formularioViaje);

    const toast = await this.toastController.create({
      message: 'El viaje ha sido terminado.',
      duration: 2000,
      position: 'bottom',
      color: 'warning',
    });
    this.viajeEnCurso = false;
    await toast.present();
  }

  ngOnInit() {}
}
