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
import { TurnosAdminComponent } from './components/turnos-admin/turnos-admin.component';
import { GraficosComponent } from './components/graficos/graficos.component';
import { SeccionPacientesXEspecialistaComponent } from './components/seccion-pacientes-x-especialista/seccion-pacientes-x-especialista.component';

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
    component: RegistroPacienteComponent,
  },
  {
    path: 'registro-especialista',
    component: RegistroEspecialistaComponent,
  },
  {
    path: 'registro-admin',
    component: RegistroAdminComponent,
    canActivate: [authGuard],
    data: { role: 'admin' },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { animation: 'login' }
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [authGuard],
    data: { role: 'admin', animation: 'usuarios' },
  },
  {
    path: 'turnos-admin',
    component: TurnosAdminComponent,
    canActivate: [authGuard],
    data: { role: 'admin', animation: 'turnos-admin' },
  },
  {
    path: 'estadisticas',
    component: GraficosComponent,
    canActivate: [authGuard],
    data: { role: 'admin', animation: 'estadisticas' },
  },
  {
    path: 'mi-perfil-especialista',
    component: MiPerfilEspecialistaComponent,
    canActivate: [authGuard],
    data: { role: 'especialista', animation: 'mi-perfil-especialista' },
  },
  {
    path: 'mi-perfil-paciente',
    component: MiPerfilPacienteComponent,
    canActivate: [authGuard],
    data: { role: 'paciente', animation: 'mi-perfil-paciente' },
  },
  {
    path: 'solicitar-turnos',
    component: SolicitarTurnosComponent,
    canActivate: [authGuard],
    data: { role: 'paciente', animation: 'solicitar-turnos' },
  },
  {
    path: 'mis-turnos-paciente',
    component: MisTurnosPacienteComponent,
    canActivate: [authGuard],
    data: { role: 'paciente', animation: 'mis-turnos-paciente' },
  },
  {
    path: 'mis-turnos-especialista',
    component: MisTurnosEspecialistaComponent,
    canActivate: [authGuard],
    data: { role: 'especialista', animation: 'mis-turnos-especialista' },
  },
  {
    path: 'seccion-pacientes-x-especialista',
    component: SeccionPacientesXEspecialistaComponent,
    canActivate: [authGuard],
    data: { role: 'especialista', animation: 'seccion-pacientes-x-especialista' },
  },
  {
    path: 'guardar-historia-clinica',
    children: [
      {
        path: ':turnoId',
        loadComponent: () =>
          import(
            './components/cargar-historia-clinica/cargar-historia-clinica.component'
          ).then((c) => c.CargarHistoriaClinicaComponent),
      },
    ],
    canActivate: [authGuard],
    data: { role: 'especialista', animation: 'guardar-historia-clinica' },
  },
  { path: '**', component: LandingComponent },
];
