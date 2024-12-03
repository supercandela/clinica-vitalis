import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderEspecialistaComponent } from '../header-especialista/header-especialista.component';
import { SpinnerDirective } from '../../directives/spinner.directive';
import { TurnosService } from '../../services/turnos.service';
import { Usuario } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CapitalizarPrimeraLetraPipe } from "../../pipes/capitalizar-primera-letra.pipe";
import { BooleanATextoPipe } from "../../pipes/boolean-a-texto.pipe";

@Component({
  selector: 'app-seccion-pacientes-x-especialista',
  standalone: true,
  imports: [HeaderEspecialistaComponent, SpinnerDirective, CommonModule, CapitalizarPrimeraLetraPipe, BooleanATextoPipe],
  templateUrl: './seccion-pacientes-x-especialista.component.html',
  styleUrl: './seccion-pacientes-x-especialista.component.scss',
})
export class SeccionPacientesXEspecialistaComponent
  implements OnInit, OnDestroy
{
  isLoading: boolean = false;
  usuario?: Usuario;
  sub?: Subscription;
  misTurnosConDatosPaciente: any[] = [];
  listadoPacientesSinRepetir: any[] = [];
  pacienteSeleccionado: any | null = null;
  turnosFiltradosPorPaciente: any[] = [];
  mostrarFab: boolean = false;

  constructor(
    private authService: AuthService,
    private turnosService: TurnosService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.usuarioActual;

    this.sub = this.turnosService
      .obtenerTurnosConUsuario('especialistaId', this.usuario?.id, 'pacienteId')
      .subscribe((respuesta: any) => {
        this.misTurnosConDatosPaciente = respuesta.sort((a: any, b: any) => {
          return b.fecha - a.fecha;
        });
        console.log(this.misTurnosConDatosPaciente);
        this.isLoading = false;
        this.listadoPacientesSinRepetir = this.obtenerDatosUnicosPorPaciente(
          this.misTurnosConDatosPaciente
        );
        console.log(this.listadoPacientesSinRepetir);
      });
  }

  obtenerDatosUnicosPorPaciente(turnos: any[]) {
    const pacientesUnicos: any = {};

    turnos.forEach((turno) => {
      if (!pacientesUnicos[turno.pacienteId]) {
        pacientesUnicos[turno.pacienteId] = turno.usuario;
      }
    });

    return Object.values(pacientesUnicos);
  }

  mostrarDetallesPaciente(paciente: any): void {
    this.pacienteSeleccionado = paciente;
    this.turnosFiltradosPorPaciente = this.misTurnosConDatosPaciente.filter(turno =>
      turno.pacienteId === paciente.id
    );
    console.log(this.turnosFiltradosPorPaciente);
  }

  mostrarUsuarios() {
    this.mostrarFab = !this.mostrarFab;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
