import { Component, OnDestroy, OnInit } from '@angular/core';
import { EstadoTurno, TurnosService } from '../../services/turnos.service';
import { Usuario } from '../../models/usuario.model';
import { Turno } from '../../models/turno.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderEspecialistaComponent } from '../header-especialista/header-especialista.component';
import { ModalCancelacionTurnosDirective } from '../../directives/modal-cancelacion-turnos.directive';

import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { SpinnerDirective } from '../../directives/spinner.directive';
import { EstadoTurnoColorDirective } from '../../directives/estado-turno-color.directive';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-turnos-especialista',
  standalone: true,
  imports: [
    HeaderEspecialistaComponent,
    CommonModule,
    ModalCancelacionTurnosDirective,
    RouterModule,
    SpinnerDirective,
    EstadoTurnoColorDirective,
    FormsModule
  ],
  templateUrl: './mis-turnos-especialista.component.html',
  styleUrl: './mis-turnos-especialista.component.scss',
})
export class MisTurnosEspecialistaComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  usuario?: Usuario;
  misTurnosConDatosPaciente: any[] = [];
  misTurnosFiltrados: any[] = [];
  filtro: string = '';
  sub?: Subscription;

  constructor(
    private authService: AuthService,
    private turnosService: TurnosService
  ) {}

  ngOnInit() {
    this.usuario = this.authService.usuarioActual;

    this.isLoading = true;

    this.sub = this.turnosService
      .obtenerTurnosConUsuario('especialistaId', this.usuario?.id, 'pacienteId')
      .subscribe((respuesta: any) => {
        this.misTurnosConDatosPaciente = respuesta.sort((a: any, b: any) => {
          return b.fecha - a.fecha;
        });
        this.misTurnosConDatosPaciente = this.misTurnosConDatosPaciente.map(
          (turno) => ({
            ...turno,
            resenaEsVisible: false,
          })
        );
        console.log(this.misTurnosConDatosPaciente);
        this.actualizarFiltro('');
        this.isLoading = false;
      });

    this.handleReject = this.handleReject.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  async aceptarTurno(turnoId: string) {
    try {
      await this.cambiarEstadoTurno(turnoId, EstadoTurno.aceptado);
      Swal.fire({
        icon: 'success',
        title: 'Turno actualizado',
        text: 'El estado del turno fue actualizado a: ' + EstadoTurno.aceptado,
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Algo salió mal',
        text: error,
      });
    }
  }

  async handleCancel(comentario: string, turnoId: any) {
    try {
      await this.cambiarEstadoTurno(turnoId, EstadoTurno.cancelado, comentario);
      Swal.fire({
        icon: 'success',
        title: 'Turno actualizado',
        text: 'El estado del turno fue actualizado a: ' + EstadoTurno.cancelado,
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Algo salió mal',
        text: error,
      });
    }
  }

  async handleReject(comentario: string, turnoId: any) {
    try {
      await this.cambiarEstadoTurno(turnoId, EstadoTurno.rechazado, comentario);
      Swal.fire({
        icon: 'success',
        title: 'Turno actualizado',
        text: 'El estado del turno fue actualizado a: ' + EstadoTurno.rechazado,
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Algo salió mal',
        text: error,
      });
    }
  }

  async cambiarEstadoTurno(
    turnoId: string,
    nuevoEstado: string,
    comentario: string = ''
  ) {
    (await this.turnosService.cambiarEstadoTurnoPorId(
      turnoId,
      nuevoEstado,
      comentario
    )) as string;
  }

  verResena(turno: any) {
    turno.resenaEsVisible = !turno.resenaEsVisible;
  }

  actualizarFiltro(filtro: string): void {
    if (filtro.length >= 3) {
      this.filtro = filtro.toLowerCase();

      this.misTurnosFiltrados = this.misTurnosConDatosPaciente.filter((turno) =>
        this.objetoCoincideConFiltro(turno, this.filtro)
      );
    } else {
      this.misTurnosFiltrados = [...this.misTurnosConDatosPaciente];
    }
    console.log(this.misTurnosFiltrados);
  }

  private objetoCoincideConFiltro(obj: any, filtro: string): boolean {
    for (const [key, val] of Object.entries(obj)) {
      if (key.toLowerCase().includes(filtro)) {
        return true;
      }

      if (
        val != null &&
        typeof val !== 'object' &&
        val.toString().toLowerCase().includes(filtro)
      ) {
        return true;
      }

      if (val != null && typeof val === 'object') {
        if (this.objetoCoincideConFiltro(val, filtro)) {
          return true;
        }
      }
    }
    return false;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
