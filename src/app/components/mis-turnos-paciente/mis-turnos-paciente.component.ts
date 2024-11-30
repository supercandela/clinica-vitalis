import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderPacienteComponent } from '../header-paciente/header-paciente.component';
import { TurnosService } from '../../services/turnos.service';
import { Usuario } from '../../models/usuario.model';
import { Turno } from '../../models/turno.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mis-turnos-paciente',
  standalone: true,
  imports: [HeaderPacienteComponent, CommonModule],
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
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
