import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreoActividadComponent } from './componentes/creo-actividad/creo-actividad.component';
import { CreoItinerarioComponent } from './componentes/creo-itinerario/creo-itinerario.component';
import { CreoUsuarioComponent } from './componentes/creo-usuario/creo-usuario.component';
import { HomeComponent } from './componentes/home/home.component';
import { ItinerarioComponent } from './componentes/itinerario/itinerario.component';
import { PerfilUsuarioComponent } from './componentes/perfil-usuario/perfil-usuario.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { GuardService } from './guards/guard.service';
import { LoginComponent } from './shared/login/login.component';


const routes: Routes = [

  { path: '', component: HomeComponent },
  {path: 'itinerario/:_itinerarioId', component: ItinerarioComponent},
  {path: 'creo-usuario', component: CreoUsuarioComponent},
  {path: 'login' , component: LoginComponent},
  {path: 'creo-actividad', component: CreoActividadComponent , canActivate:[GuardService], data: {expectedRol: ['admin']}},
  {path: 'creo-itinerario', component: CreoItinerarioComponent, canActivate:[GuardService], data: {expectedRol: ['admin']}},
  {path: 'miPerfil/:_nombreUsuario', component: PerfilUsuarioComponent , canActivate:[GuardService], data: {expectedRol: ['admin' , 'user']}},
  {path: 'usuariosPanel', component: UsuariosComponent , canActivate:[GuardService], data: {expectedRol: ['admin' ]}},
  {path: '**', component: HomeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
