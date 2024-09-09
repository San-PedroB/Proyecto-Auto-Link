import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ModalController, ToastController} from '@ionic/angular';

import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { FormularioService } from '../services/formulario.service'; // Importar servicio del formulario guardado OJO


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;
  
  constructor(public fb: FormBuilder, private toastController: ToastController, private modalController: ModalController,
     private formularioService: FormularioService ) {
    this.formularioLogin = this.fb.group({
      "email": new FormControl("", [Validators.required, Validators.email]),
      "password": new FormControl("", Validators.required)
    })
   }
   
   async iniciarSesion(){
    // Validación del formulario
    if(this.formularioLogin.invalid){
      const toastErrorCampos = await this.toastController.create({
        message: "Porfavor completa correctamente todos los campos", 
        duration: 3000,
        position: 'bottom'
      });
      await toastErrorCampos.present();
      return;
    }
     // Obtener los datos almacenados del formulario de registro
     const datosAlmacenados = this.formularioService.getDatos(); // Aseguurate de que "setDatos" haya guardado antes
     // Compara el email ingresado con el almacenado en el servicio
    if(this.formularioLogin.value.email != datosAlmacenados.email || 
      this.formularioLogin.value.password != datosAlmacenados.password){
        const toastErrorUsuario = await this.toastController.create({
          message: "Correo o contraseña incorrectos. Por favor, intenta nuevamente.",
          duration: 3000,
          position: 'top'
        })
        await toastErrorUsuario.present();
        return;
    }

    console.log("Iniciando Sesion...");
    this.abrirModalLogin();
   }

   async abrirModalLogin(){
    const modal = await this.modalController.create({
      component: ModalLoginComponent
    })
    return await modal.present();
   }



  ngOnInit() {
  }

}
