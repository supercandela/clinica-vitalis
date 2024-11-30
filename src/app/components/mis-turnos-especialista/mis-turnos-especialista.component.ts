import { Component, OnInit } from '@angular/core';
import { EstadoTurno, TurnosService } from '../../services/turnos.service';
import { Usuario } from '../../models/usuario.model';
import { Turno } from '../../models/turno.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderEspecialistaComponent } from '../header-especialista/header-especialista.component';
import { ModalCancelacionTurnosDirective } from '../../directives/modal-cancelacion-turnos.directive';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-turnos-especialista',
  standalone: true,
  imports: [HeaderEspecialistaComponent, CommonModule, ModalCancelacionTurnosDirective],
  templateUrl: './mis-turnos-especialista.component.html',
  styleUrl: './mis-turnos-especialista.component.scss'
})
export class MisTurnosEspecialistaComponent implements OnInit {
  usuario?: Usuario;
  misTurnos: Turno[] = [];
  misTurnosConDatosPaciente: any[] = [];

  constructor (
    private authService: AuthService,
    private turnosService: TurnosService
  ) {

  }

  async ngOnInit() {
    this.usuario = this.authService.usuarioActual;

    this.misTurnos = await this.turnosService.obtenerTurnosPorCampo('especialistaId', this.usuario?.id);
    console.log(this.misTurnos);

    this.misTurnosConDatosPaciente = await this.turnosService.agregarUsuarioATurnos(this.misTurnos, "pacienteId");

    this.handleReject = this.handleReject.bind(this);

    console.log(this.misTurnosConDatosPaciente);
  }

  async aceptarTurno (turnoId: string) {
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

  async handleCancel (comentario: string, turnoId: any) {
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

  async handleReject (comentario: string, turnoId: any) {
    console.log('handleReject this:', this);
    try {
      await this.cambiarEstadoTurno(turnoId, EstadoTurno.rechazado, comentario);
      console.log("entro al try")
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
  
  async cambiarEstadoTurno (turnoId: string, nuevoEstado: string, comentario: string = '') {
    console.log("entro al método")
    await this.turnosService.cambiarEstadoTurnoPorId(turnoId, nuevoEstado, comentario) as string;
  }

}
