import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  ToastController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { FormularioService } from '../../services/formulario.service'; // Importar el servicio

import { FirestoreService } from '../../services/firestore/firestore.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  formularioRegistro: FormGroup;

  constructor(
    public modalController: ModalController,
    public fb: FormBuilder,
    private toastController: ToastController,
    private formularioService: FormularioService,
    private navController: NavController,
    private firestoreService: FirestoreService
  ) {
    this.formularioRegistro = this.fb.group({
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmarPassword: new FormControl('', Validators.required),
    });
  }

  async registrarse() {
    if (this.formularioRegistro.invalid) {
      const toastError = await this.toastController.create({
        message: 'Porfavor completa correctamente todos los campos',
        duration: 3000,
        position: 'bottom',
      });
      await toastError.present();
      return;
    }
    this.enviarFormulario();
  }

  async enviarFormulario() {
    if (this.formularioRegistro.valid) {
      await this.firestoreService.createDocument(
        'users', //nombre de la coleccion
        this.formularioRegistro.value
      );
      console.log('Datos guardados:', this.formularioRegistro.value);
      const toastRegistro = await this.toastController.create({
        message: '¡Usuario creado exitosamente!',
        duration: 3000,
        position: 'bottom',
      });
      await toastRegistro.present();
      this.navController.navigateRoot('/login');
    }
  }

  ngOnInit() {}
}
