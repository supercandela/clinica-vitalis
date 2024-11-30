import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderPacienteComponent } from '../header-paciente/header-paciente.component';
import { EstadoTurno, TurnosService } from '../../services/turnos.service';
import { Usuario } from '../../models/usuario.model';
import { Turno } from '../../models/turno.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalCancelacionTurnosDirective } from '../../directives/modal-cancelacion-turnos.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-turnos-paciente',
  standalone: true,
  imports: [HeaderPacienteComponent, CommonModule, ModalCancelacionTurnosDirective],
  templateUrl: './mis-turnos-paciente.component.html',
  styleUrl: './mis-turnos-paciente.component.scss',
})
export class MisTurnosPacienteComponent implements OnInit, OnDestroy {
  usuario?: Usuario;
  misTurnos: Turno[] = [];
  misTurnosConDatosEspecialistas: any[] = [];
  sub?: Subscription;

  constructor(
    private authService: AuthService,
    private turnosService: TurnosService
  ) {}

  async ngOnInit() {
    this.usuario = this.authService.usuarioActual;

    this.sub = this.turnosService
      .obtenerTurnosConUsuario('pacienteId', this.usuario?.id, 'especialistaId')
      .subscribe((respuesta: any) => {
        this.misTurnosConDatosEspecialistas = respuesta.sort(
          (a: any, b: any) => {
            return b.fecha - a.fecha;
          }
        );
        console.log(this.misTurnosConDatosEspecialistas);
      });

      this.handleCancel = this.handleCancel.bind(this);
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

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
