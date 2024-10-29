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
import { GuardarCorreoService } from 'src/app/services/guardar-correo.service';

@Component({
  selector: 'app-crear-viaje',
  templateUrl: './crear-viaje.page.html',
  styleUrls: ['./crear-viaje.page.scss'],
})
export class CrearViajePage implements OnInit {
  formularioViaje: FormGroup;
  numeroPasajeros: number = 0;
  viajeEnCurso: boolean = false;
  viajesArray: any[] = [];

  constructor(
    private servicioViajes: ServicioViajesService,
    private toastController: ToastController,
    private navController: NavController,
    private formBuilder: FormBuilder,
    private firestoreService: FirestoreService,
    private guardarCorreoService: GuardarCorreoService
  ) {
    this.formularioViaje = this.formBuilder.group({
      origen: new FormControl('', Validators.required),
      destino: new FormControl('', Validators.required),
      precio: new FormControl('', Validators.required),
      cantidadPasajeros: new FormControl(1, Validators.required),
      estado: new FormControl(''),
    });
  }

  async crearViaje() {
    // Verificar si ya hay un viaje activo antes de crear uno nuevo
    const viajeActivo = await this.verificarViajeActivo();

    if (viajeActivo) {
      // Si ya existe un viaje activo, muestra un mensaje de advertencia
      const toast = await this.toastController.create({
        message:
          'Ya tienes un viaje activo. Debes finalizarlo antes de crear uno nuevo.',
        duration: 3000,
        position: 'bottom',
        color: 'warning',
      });
      await toast.present();
      return;
    }

    // Verificación de campos del formulario
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

    // Si no hay un viaje activo, procede a crear uno nuevo
    this.viajeEnCurso = true;
    await this.enviarFormularioViaje();
    this.obtenerCantidadPasajeros();
    console.log(this.formularioViaje.value);
    console.log('Viaje creado');
    this.navController.navigateRoot('/listado-de-viajes');
  }

  async verificarViajeActivo(): Promise<boolean> {
    const correoConductor = this.guardarCorreoService.getCorreoUsuario();

    if (!correoConductor) {
      // Si no hay correo del conductor, no se puede proceder
      console.warn('Correo del conductor no encontrado.');
      return false;
    }

    // Verificar si hay un viaje asociado al conductor
    const viaje = await this.firestoreService.getDocumentByQuery(
      'viajes',
      'conductorCorreo',
      correoConductor
    );

    // Si hay un viaje encontrado, verifica si está en estado 'pendiente'
    if (viaje && viaje['estado'] === 'pendiente') {
      return true; // Hay un viaje activo
    }

    return false; // No hay un viaje activo
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
      const correoConductor = this.guardarCorreoService.getCorreoUsuario();

      // Crear un nuevo objeto de viaje basado en los valores del formulario
      const nuevoViaje = {
        origen: this.formularioViaje.value.origen,
        destino: this.formularioViaje.value.destino,
        precio: this.formularioViaje.value.precio,
        cantidadPasajeros: this.formularioViaje.value.cantidadPasajeros,
        estado: 'pendiente', // Asignar estado inicial como 'pendiente'
        conductorCorreo: correoConductor,
      };

      // Agregar el nuevo viaje al arreglo de viajes
      this.viajesArray.push(nuevoViaje);

      // Guardar el viaje individual en Firestore
      await this.firestoreService.createDocument('viajes', nuevoViaje);

      // Depuración: Ver el arreglo completo de viajes
      console.log('Arreglo de viajes actualizado:', this.viajesArray);
    }
  }

  ngOnInit() {}
}
