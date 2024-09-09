import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViajesEnCursoPage } from './viajes-en-curso.page';

const routes: Routes = [
  {
    path: '',
    component: ViajesEnCursoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViajesEnCursoPageRoutingModule {}
