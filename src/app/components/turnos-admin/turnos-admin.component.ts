import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { EstadoTurnoColorDirective } from '../../directives/estado-turno-color.directive';
import { CommonModule } from '@angular/common';
import { SpinnerDirective } from '../../directives/spinner.directive';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { TurnosService, EstadoTurno } from '../../services/turnos.service';
import { ModalCancelacionTurnosDirective } from '../../directives/modal-cancelacion-turnos.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos-admin',
  standalone: true,
  imports: [HeaderComponent, EstadoTurnoColorDirective, CommonModule, SpinnerDirective, ModalCancelacionTurnosDirective],
  templateUrl: './turnos-admin.component.html',
  styleUrl: './turnos-admin.component.scss'
})
export class TurnosAdminComponent implements OnInit, OnDestroy {
  turnosCompletos: any[] = [];
  isLoading: boolean = false;
  sub?: Subscription;
  usuario?: Usuario;

  constructor (
    private authService: AuthService,
    private turnosService: TurnosService
  ) {

  }

  ngOnInit() {
    this.usuario = this.authService.usuarioActual;
    this.isLoading = true;

    this.sub = this.turnosService
    .obtenerTurnosConEspecialistaYPaciente()
    .subscribe((respuesta: any) => {
      this.turnosCompletos = respuesta.sort((a: any, b: any) => {
        return b.fecha - a.fecha;
      });
      this.turnosCompletos = this.turnosCompletos.map(turno => ({
        ...turno,
        resenaEsVisible: false
      }));
      console.log(this.turnosCompletos);
      this.isLoading = false;
    });
    
    this.handleCancel = this.handleCancel.bind(this);
  }

  verResena(turno: any) {
    turno.resenaEsVisible = !turno.resenaEsVisible;
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
