import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ModalController, NavController, ToastController} from '@ionic/angular';


import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';
import { LoginService } from '../../services/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;

  usuario: string = "";
  password: string = "";

  navController = inject(NavController);

  
  constructor(public fb: FormBuilder, private toastController: ToastController, private modalController: ModalController,
     private loginService: LoginService ) {
    this.formularioLogin = this.fb.group({
      "email": new FormControl("", [Validators.required, Validators.email]),
      "password": new FormControl("", Validators.required)
    })
   }

   async login(){
    if(this.formularioLogin.invalid){
      const toastErrorCampos = await this.toastController.create({
        message: "Porfavor completa correctamente todos los campos", 
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toastErrorCampos.present();
      return;
    }

    this.abrirModalLogin();
    
   }
   
   async abrirModalLogin(){
    const modal = await this.modalController.create({
      component: ModalLoginComponent,
      cssClass: 'custom-modal-class',
    })
    return await modal.present();
   }



  ngOnInit() {
  }

}
