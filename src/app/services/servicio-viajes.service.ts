import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioViajesService {

  private datosViaje: any = null;  // Solo un objeto de viaje

  constructor() { }

  // Método para establecer los datos del viaje
  setDatos(datos: any) {
    this.datosViaje = datos;
  }

  // Método para obtener los datos del viaje
  getDatos() {
    return this.datosViaje;
  }

  // Método para borrar el viaje actual
  borrarViaje() {
    this.datosViaje = null;
  }

  // Función para terminar el viaje y resetear el formulario
  terminarViaje(formularioViaje: any) {
    // Borra los datos del formulario
    formularioViaje.reset();

    // Borra el viaje actual
    this.borrarViaje();
  }
}
