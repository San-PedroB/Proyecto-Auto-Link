import { Component, OnInit } from '@angular/core';
import { ServicioViajesService } from 'src/app/services/servicio-viajes.service';


@Component({
  selector: 'app-viaje-actual',
  templateUrl: './viaje-actual.page.html',
  styleUrls: ['./viaje-actual.page.scss'],
})
export class ViajeActualPage implements OnInit {

  viajeActual: any = null;

  constructor(private servicioViajes: ServicioViajesService) { }

  ngOnInit() {
    this.viajeActual = this.servicioViajes.getDatos();
    console.log('Viaje:', this.viajeActual);
  }

}
