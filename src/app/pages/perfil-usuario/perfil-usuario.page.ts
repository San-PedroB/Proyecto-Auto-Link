import { Component, OnInit } from '@angular/core';
import { FormularioService } from '../../services/formulario.service'; // Importar el servicio

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {
  datosFormulario: any = {}


  constructor(private formularioService: FormularioService) { }

  ngOnInit() {
    this.datosFormulario = this.formularioService.getDatos();
    // Verificar si los datos se cargan correctamente
    console.log('Datos del usuario:', this.datosFormulario);
  }

}
