import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroPacienteComponent } from './components/registro-paciente/registro-paciente.component';
import { RegistroEspecialistaComponent } from './components/registro-especialista/registro-especialista.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { RegistroAdminComponent } from './components/registro-admin/registro-admin.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'registro',
    component: RegistroComponent,
  },
  {
    path: 'registro-paciente',
    component: RegistroPacienteComponent
  },
  {
    path: 'registro-especialista',
    component: RegistroEspecialistaComponent
  },
  {
    path: 'registro-admin',
    component: RegistroAdminComponent,
    canActivate: [authGuard],
    data: { role: 'admin' }
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [authGuard],
    data: { role: 'admin' }
  },
  { path: '**', component: LandingComponent }
];
