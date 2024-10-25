import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { FirestoreService } from '../../services/firestore/firestore.service';

import { ModalLoginComponent } from '../../components/modal-login/modal-login.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formularioLogin: FormGroup;

  usuario: string = '';
  password: string = '';

  navController = inject(NavController);

  constructor(
    public fb: FormBuilder,
    private toastController: ToastController,
    private modalController: ModalController,
    private firestoreService: FirestoreService
  ) {
    this.formularioLogin = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  async autenticarUsuario() {
    const dataEmail = await this.firestoreService.getDocumentByQuery(
      'users',
      'email',
      this.formularioLogin.value.email
    );
    const dataPassword = await this.firestoreService.getDocumentByQuery(
      'users',
      'password',
      this.formularioLogin.value.password
    );
    if (this.formularioLogin.invalid) {
      const toastErrorCampos = await this.toastController.create({
        message: 'Porfavor completa correctamente todos los campos',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toastErrorCampos.present();
      return;
    }
    this.abrirModalLogin();
  }

  async abrirModalLogin() {
    const modal = await this.modalController.create({
      component: ModalLoginComponent,
      cssClass: 'custom-modal-class',
    });
    return await modal.present();
  }

  ngOnInit() {}
}
