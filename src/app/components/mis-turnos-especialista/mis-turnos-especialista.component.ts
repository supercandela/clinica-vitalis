import { Component, OnInit } from '@angular/core';
import { HeaderPacienteComponent } from '../header-paciente/header-paciente.component';
import { TurnosService } from '../../services/turnos.service';
import { Usuario } from '../../models/usuario.model';
import { Turno } from '../../models/turno.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderEspecialistaComponent } from '../header-especialista/header-especialista.component';

@Component({
  selector: 'app-mis-turnos-especialista',
  standalone: true,
  imports: [HeaderEspecialistaComponent, CommonModule],
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

    console.log(this.misTurnosConDatosPaciente);
  }

  async aceptarTurno (turnoId: string) {
    await this.cambiarEstadoTurno(turnoId, "Aceptado");
  }

  async cancelarTurno (turnoId: string) {
    //Agregar comentario
    await this.cambiarEstadoTurno(turnoId, "Cancelado");
  }
  
  async cambiarEstadoTurno (turnoId: string, nuevoEstado: string) {
    await this.turnosService.cambiarEstadoTurnoPorId(turnoId, nuevoEstado);
  }

}
