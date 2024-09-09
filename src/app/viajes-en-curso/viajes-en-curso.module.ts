import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajesEnCursoPageRoutingModule } from './viajes-en-curso-routing.module';

import { ViajesEnCursoPage } from './viajes-en-curso.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajesEnCursoPageRoutingModule
  ],
  declarations: [ViajesEnCursoPage]
})
export class ViajesEnCursoPageModule {}
