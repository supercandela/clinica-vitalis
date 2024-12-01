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

@Component({
  selector: 'app-mis-turnos-especialista',
  standalone: true,
  imports: [
    HeaderEspecialistaComponent,
    CommonModule,
    ModalCancelacionTurnosDirective,
    RouterModule,
  ],
  templateUrl: './mis-turnos-especialista.component.html',
  styleUrl: './mis-turnos-especialista.component.scss',
})
export class MisTurnosEspecialistaComponent implements OnInit, OnDestroy {
  usuario?: Usuario;
  misTurnos: Turno[] = [];
  misTurnosConDatosPaciente: any[] = [];
  sub?: Subscription;
  subTurnosConDatos?: Subscription;

  constructor(
    private authService: AuthService,
    private turnosService: TurnosService
  ) {}

  async ngOnInit() {
    this.usuario = this.authService.usuarioActual;

    this.sub = this.turnosService
      .obtenerTurnosConUsuario('especialistaId', this.usuario?.id, 'pacienteId')
      .subscribe((respuesta: any) => {
        this.misTurnosConDatosPaciente = respuesta.sort((a: any, b: any) => {
          return b.fecha - a.fecha;
        });
        this.misTurnosConDatosPaciente = this.misTurnosConDatosPaciente.map(turno => ({
          ...turno,
          resenaEsVisible: false
        }));
        console.log(this.misTurnosConDatosPaciente);
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

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
