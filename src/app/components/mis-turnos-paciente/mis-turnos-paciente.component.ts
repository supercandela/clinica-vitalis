import { Component, OnInit } from '@angular/core';
import { HeaderPacienteComponent } from '../header-paciente/header-paciente.component';
import { TurnosService } from '../../services/turnos.service';
import { Usuario } from '../../models/usuario.model';
import { Turno } from '../../models/turno.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-turnos-paciente',
  standalone: true,
  imports: [HeaderPacienteComponent, CommonModule],
  templateUrl: './mis-turnos-paciente.component.html',
  styleUrl: './mis-turnos-paciente.component.scss'
})
export class MisTurnosPacienteComponent implements OnInit {
  usuario?: Usuario;
  misTurnos: Turno[] = [];
  misTurnosConDatosEspecialistas: any[] = [];

  constructor (
    private authService: AuthService,
    private turnosService: TurnosService
  ) {

  }

  async ngOnInit() {
    this.usuario = this.authService.usuarioActual;

    this.misTurnos = await this.turnosService.obtenerTurnosPorCampo('pacienteId', this.usuario?.id);
    console.log(this.misTurnos);

    this.misTurnosConDatosEspecialistas = await this.turnosService.agregarUsuarioATurnos(this.misTurnos, "especialistaId");

    console.log(this.misTurnosConDatosEspecialistas);
  }

}
