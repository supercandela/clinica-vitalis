import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroPacienteComponent } from './components/registro-paciente/registro-paciente.component';
import { RegistroEspecialistaComponent } from './components/registro-especialista/registro-especialista.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { RegistroAdminComponent } from './components/registro-admin/registro-admin.component';
import { authGuard } from './guards/auth.guard';
import { MiPerfilEspecialistaComponent } from './components/mi-perfil-especialista/mi-perfil-especialista.component';
import { MiPerfilPacienteComponent } from './components/mi-perfil-paciente/mi-perfil-paciente.component';
import { SolicitarTurnosComponent } from './components/solicitar-turnos/solicitar-turnos.component';
import { MisTurnosPacienteComponent } from './components/mis-turnos-paciente/mis-turnos-paciente.component';
import { MisTurnosEspecialistaComponent } from './components/mis-turnos-especialista/mis-turnos-especialista.component';

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
  {
    path: 'mi-perfil-especialista',
    component: MiPerfilEspecialistaComponent,
    canActivate: [authGuard],
    data: { role: 'especialista' }
  },
  {
    path: 'mi-perfil-paciente',
    component: MiPerfilPacienteComponent,
    canActivate: [authGuard],
    data: { role: 'paciente' }
  },
  {
    path: 'solicitar-turnos',
    component: SolicitarTurnosComponent,
    canActivate: [authGuard],
    data: { role: 'paciente' }
  },
  {
    path: 'mis-turnos-paciente',
    component: MisTurnosPacienteComponent,
    canActivate: [authGuard],
    data: { role: 'paciente' }
  },
  {
    path: 'mis-turnos-especialista',
    component: MisTurnosEspecialistaComponent,
    canActivate: [authGuard],
    data: { role: 'especialista' }
  },
  { path: '**', component: LandingComponent }
];
