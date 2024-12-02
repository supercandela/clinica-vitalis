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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-turnos-admin',
  standalone: true,
  imports: [
    HeaderComponent,
    EstadoTurnoColorDirective,
    CommonModule,
    SpinnerDirective,
    ModalCancelacionTurnosDirective,
    FormsModule,
  ],
  templateUrl: './turnos-admin.component.html',
  styleUrl: './turnos-admin.component.scss',
})
export class TurnosAdminComponent implements OnInit, OnDestroy {
  turnosCompletos: any[] = [];
  isLoading: boolean = false;
  sub?: Subscription;
  usuario?: Usuario;
  misTurnosFiltrados: any[] = [];
  filtro: string = '';

  constructor(
    private authService: AuthService,
    private turnosService: TurnosService
  ) {}

  ngOnInit() {
    this.usuario = this.authService.usuarioActual;
    this.isLoading = true;

    this.sub = this.turnosService
      .obtenerTurnosConEspecialistaYPaciente()
      .subscribe((respuesta: any) => {
        this.turnosCompletos = respuesta.sort((a: any, b: any) => {
          return b.fecha - a.fecha;
        });
        this.turnosCompletos = this.turnosCompletos.map((turno) => ({
          ...turno,
          resenaEsVisible: false,
        }));
        console.log(this.turnosCompletos);
        this.actualizarFiltro('');
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

  actualizarFiltro(filtro: string): void {
    if (filtro.length >= 3) {
      this.filtro = filtro.toLowerCase();

      this.misTurnosFiltrados = this.turnosCompletos.filter(
        (turno) => this.objetoCoincideConFiltro(turno, this.filtro)
      );
    } else {
      this.misTurnosFiltrados = [...this.turnosCompletos];
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
