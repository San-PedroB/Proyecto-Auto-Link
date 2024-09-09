import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController} from '@ionic/angular';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { Router } from '@angular/router';
import { FormularioService } from '../services/formulario.service'; // Importar el servicio

@Component({
  selector: 'app-home-pasajero',
  templateUrl: './home-pasajero.page.html',
  styleUrls: ['./home-pasajero.page.scss'],
})
export class HomePasajeroPage implements OnInit {
  datosFormulario: any = {}

  constructor(private modalController: ModalController, private router: Router, private formularioService: FormularioService) {
    
  }

  cerrarSesion(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  
  async abrirModal(){
    const modal = await this.modalController.create({
      component: ModalLoginComponent
    })
    return await modal.present();
   }

  ngOnInit() {
    this.datosFormulario = this.formularioService.getDatos();
    // Verificar si los datos se cargan correctamente
    console.log('Datos del usuario:', this.datosFormulario);
  }



}
