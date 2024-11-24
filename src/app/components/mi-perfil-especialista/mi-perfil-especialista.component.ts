import { Component, OnInit } from '@angular/core';
import { HeaderEspecialistaComponent } from '../header-especialista/header-especialista.component';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario.model';
import { FormsModule } from '@angular/forms';

import { Horario } from '../../models/horario.model';
import { HorariosService } from '../../services/horarios.service';

@Component({
  selector: 'app-mi-perfil-especialista',
  standalone: true,
  imports: [HeaderEspecialistaComponent, CommonModule, FormsModule],
  templateUrl: './mi-perfil-especialista.component.html',
  styleUrl: './mi-perfil-especialista.component.scss',
})
export class MiPerfilEspecialistaComponent implements OnInit {
  usuario?: Usuario;
  diasSemana: string[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  // Lista inicial de horarios
  horarios: any[] = [];

  constructor(
    private authService: AuthService,
    private horariosService: HorariosService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.usuarioActual;

    this.horariosService.obtenerHorarios(this.usuario.id).subscribe({
      next: (horarios) => {
        if (horarios.length === 0) {
          this.horarios = [
            {
              especialidad: '',
              duracion: 30,
              dia: '',
              horaInicio: '',
              horaFin: '',
              opcionesHoras: this.generarHoras(30, this.diasSemana[0]),
              opcionesHorasFin: [],
            },
          ];
        } else {
          this.horarios = horarios.map((horario) =>
            this.transformarHorarioFront(horario)
          );
          console.log(this.horarios);
        }
      },
      error: (error) => {
        console.error('Error al obtener los horarios:', error);
      },
    });
  }

  agregarRenglon() {
    this.horarios.push({
      especialidad: '',
      duracion: 30,
      dia: '',
      horaInicio: '',
      horaFin: '',
      opcionesHoras: this.generarHoras(30, this.diasSemana[0]),
      opcionesHorasFin: [],
    });
  }

  eliminarRenglon(index: number) {
    this.horarios.splice(index, 1);
  }

  actualizarHorarios(index: number) {
    const duracion = this.horarios[index].duracion;
    this.horarios[index].opcionesHoras = this.generarHoras(duracion, this.horarios[index].dia);
    this.horarios[index].opcionesHorasFin = []; // Limpiar opciones de fin hasta seleccionar una hora de inicio
    this.horarios[index].horaInicio = '';
    this.horarios[index].horaFin = '';
  }

  actualizarHorasFin(index: number) {
    const duracion = this.horarios[index].duracion;
    const horaInicio = this.horarios[index].horaInicio;
    const dia = this.horarios[index].dia;
    this.horarios[index].opcionesHorasFin = this.generarHorasFin(
      horaInicio,
      duracion,
      dia
    );
    this.horarios[index].horaFin = ''; // Resetear la hora de fin
  }

  // Método para generar las opciones de horas basado en la duración
  generarHoras(duracion: number, dia: string): string[] {
    const horas = [];
    if (dia === "Sábado") {
      for (let hora = 8; hora < 14; hora++) {
        horas.push(`${hora.toString().padStart(2, '0')}:00`);
        if (duracion === 30 && hora < 18) {
          horas.push(`${hora.toString().padStart(2, '0')}:30`);
        }
      }
    } else {
      for (let hora = 8; hora < 19; hora++) {
        horas.push(`${hora.toString().padStart(2, '0')}:00`);
        if (duracion === 30 && hora < 18) {
          horas.push(`${hora.toString().padStart(2, '0')}:30`);
        }
      }
    }
    return horas;
  }

  generarHorasFin(horaInicio: string, duracion: number, dia: string): string[] {
    const horas = [];
    let [hora, minuto] = horaInicio.split(':').map(Number);

    if (dia === "Sábado") {
      while (hora < 14 || (hora === 13 && minuto === 0)) {
        minuto += duracion;
        if (minuto >= 60) {
          minuto = 0;
          hora++;
        }
        if (hora < 14) {
          horas.push(
            `${hora.toString().padStart(2, '0')}:${minuto
              .toString()
              .padStart(2, '0')}`
          );
        }
      }
    } else {
      while (hora < 19 || (hora === 18 && minuto === 0)) {
        minuto += duracion;
        if (minuto >= 60) {
          minuto = 0;
          hora++;
        }
        if (hora < 19) {
          horas.push(
            `${hora.toString().padStart(2, '0')}:${minuto
              .toString()
              .padStart(2, '0')}`
          );
        }
      }
    }

    return horas;
  }

  transformarHorarioFront(horario: Horario): any {
    console.log(horario)
    return {
      especialidad: horario.especialidad,
      duracion: horario.duracion,
      dia: horario.dia,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      opcionesHoras: this.generarHoras(horario.duracion, horario.dia),
      opcionesHorasFin: this.generarHorasFin(horario.horaInicio, horario.duracion, horario.dia),
    };
  }

  transformarHorarioService(horario: Horario): any {
    return {
      especialidad: horario.especialidad,
      duracion: horario.duracion,
      dia: horario.dia,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
    };
  }

  guardarHorarios() {
    let horariosAGuardar = this.horarios.map((horario) =>
      this.transformarHorarioService(horario)
    );
    this.horariosService.guardarHorarios(this.authService.usuarioActual.id, horariosAGuardar);
  }
}
