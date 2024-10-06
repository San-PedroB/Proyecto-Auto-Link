import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home-conductor',
    loadChildren: () => import('./home-conductor/home-conductor.module').then( m => m.HomeConductorPageModule)
  },
  {
    path: 'home-pasajero',
    loadChildren: () => import('./home-pasajero/home-pasajero.module').then( m => m.HomePasajeroPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'perfil-usuario',
    loadChildren: () => import('./perfil-usuario/perfil-usuario.module').then( m => m.PerfilUsuarioPageModule)
  },
  {
    path: 'crear-viaje',
    loadChildren: () => import('./crear-viaje/crear-viaje.module').then( m => m.CrearViajePageModule)
  },
  {
    path: 'viajes-en-curso',
    loadChildren: () => import('./viajes-en-curso/viajes-en-curso.module').then( m => m.ViajesEnCursoPageModule)
  },
  {
    path: 'cambiar-password',
    loadChildren: () => import('./cambiar-password/cambiar-password.module').then( m => m.CambiarPasswordPageModule)
  },  {
    path: 'prueba',
    loadChildren: () => import('./prueba/prueba.module').then( m => m.PruebaPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
