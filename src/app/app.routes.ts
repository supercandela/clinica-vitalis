import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroPacienteComponent } from './components/registro-paciente/registro-paciente.component';

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
    path: 'login',
    component: LoginComponent,
  },
];