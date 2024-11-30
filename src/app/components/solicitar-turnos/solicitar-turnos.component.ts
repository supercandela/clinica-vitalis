import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderPacienteComponent } from '../header-paciente/header-paciente.component';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { HorariosService } from '../../services/horarios.service';
import { Subscription } from 'rxjs';
import moment from 'moment';
import 'moment/locale/es';
import { TurnosService } from '../../services/turnos.service';
import Swal from 'sweetalert2';

export interface profesionalData {
  idEspecialista: string;
  horarios: [
    {
      especialidad: string;
      duracion: number;
      dia: string;
      horaInicio: string;
      horaFin: string;
    }
  ];
  usuario: Usuario;
}

export enum FotosEspecialidades {
  Traumatología = '../../../assets/Imagenes-Especialidades/traumatologia.png',
  Ginecología = '../../../assets/Imagenes-Especialidades/ginecologia.png',
  Odontología = '../../../assets/Imagenes-Especialidades/odontologia.png',
  Dermatología = '../../../assets/Imagenes-Especialidades/dermatologia.png',
  Pediatría = '../../../assets/Imagenes-Especialidades/pediatria.png',
  Clínica = '../../../assets/Imagenes-Especialidades/clinica.png',
  Default = '../../../assets/Imagenes-Especialidades/default.png',
}

@Component({
  selector: 'app-solicitar-turnos',
  standalone: true,
  imports: [HeaderPacienteComponent, CommonModule],
  templateUrl: './solicitar-turnos.component.html',
  styleUrl: './solicitar-turnos.component.scss',
})
export class SolicitarTurnosComponent implements OnInit, OnDestroy {
  usuario?: Usuario;
  subHorarios?: Subscription;
  horarios: profesionalData[] = [];
  profesionalElegidoId: string = '';
  profesionalElegido?: profesionalData[];
  especialidadElegida: string = '';
  horariosFiltrados?: profesionalData[];
  proximasFechasDeAtencion?: string[];
  fechaSeleccionada?: string;
  turnosAMostrar: string[] = [];

  constructor(
    private authService: AuthService,
    private horariosService: HorariosService,
    private turnosService: TurnosService
  ) {
    moment.locale('es');
  }

  ngOnInit(): void {
    this.usuario = this.authService.usuarioActual;

    this.subHorarios = this.horariosService
      .obtenerTodosLosHorarios()
      .subscribe({
        next: (data) => {
          this.horarios = data as profesionalData[];
        },
        error: (error) => {
          console.error('Error al obtener horarios con usuarios:', error);
        },
      });
  }

  seleccionarProfesional(id: string) {
    this.profesionalElegidoId = id;
    this.horariosFiltrados = undefined;
    this.fechaSeleccionada = undefined;
    this.profesionalElegido = this.horarios.filter(
      (p) => p.idEspecialista === id
    );
  }

  obtenerImagenEspecialidad(especialidad: string) {
    const foto =
      FotosEspecialidades[especialidad as keyof typeof FotosEspecialidades];
    return foto ? foto : FotosEspecialidades.Default;
  }

  seleccionarEspecialidad(especialidad: string) {
    this.fechaSeleccionada = undefined;
    this.turnosAMostrar = [];
    this.especialidadElegida = especialidad;
    let filtro = this.profesionalElegido
      ?.map((item) => ({
        ...item,
        horarios: item.horarios.filter(
          (horario) => horario.especialidad === especialidad
        ),
      }))
      .filter((item) => item.horarios.length > 0);
    this.horariosFiltrados = filtro as profesionalData[];

    let diasAtencion = this.horariosFiltrados
      ?.map((especialista) =>
        especialista.horarios.map((horario) => horario.dia)
      )
      .flat();

    this.proximasFechasDeAtencion = this.calcularProximasFechas(diasAtencion);
  }

  calcularProximasFechas(diasAtencion: string[]): string[] {
    const fechasProximas: string[] = [];
    const diasSemana: { [key: string]: number } = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
    };

    for (let i = 0; i < 15; i++) {
      const fecha = moment().add(i, 'days');
      const diaSemana = fecha.day();
      const diaTexto = Object.keys(diasSemana).find(
        (dia) => diasSemana[dia] === diaSemana
      );

      if (diaTexto && diasAtencion.includes(diaTexto)) {
        fechasProximas.push(fecha.format('dddd, MMMM Do'));
      }
    }

    return fechasProximas;
  }

  seleccionarFecha(fecha: string) {
    this.fechaSeleccionada = fecha;
    this.generarHorariosDisponibles();
  }

  async generarHorariosDisponibles() {
    this.turnosAMostrar = [];
    this.horariosFiltrados?.forEach((especialista) => {
      if (this.fechaSeleccionada) {
        let diaArray = this.fechaSeleccionada.split(',');
        let dia = diaArray[0];
        const filtroDiasSegunSeleccion = especialista.horarios.filter(
          (horario: any) => horario.dia.toLowerCase() === dia.toLowerCase()
        );

        filtroDiasSegunSeleccion.forEach((horario: any) => {
          const inicio = moment(horario.horaInicio, 'HH:mm');
          const fin = moment(horario.horaFin, 'HH:mm');
          const duracion = horario.duracion;

          while (inicio.isBefore(fin)) {
            this.turnosAMostrar.push(inicio.format('HH:mm'));
            inicio.add(duracion, 'minutes');
          }
        });
      }
    });

    const idEspecialista = this.horariosFiltrados?.map(
      (especialista) => especialista.idEspecialista
    )[0];

    if (idEspecialista) {
      const turnos = await this.turnosService.obtenerTurnosPorDia(
        idEspecialista,
        this.especialidadElegida,
        this.formatearFecha()
      );
      this.turnosAMostrar = this.turnosAMostrar.filter(
        (horario) => !turnos.some((turno) => turno.hora === horario)
      );
    }
  }

  formatearFecha() {
    const fechaLimpia = this.fechaSeleccionada?.replace('º', '').trim();
    const fechaFormateada = moment(fechaLimpia, 'dddd, MMMM DD');
    return fechaFormateada.format('YYYY-MM-DD');
  }

  seleccionarTurno(turno: string) {
    const idEspecialista = this.horariosFiltrados?.map(
      (especialista) => especialista.idEspecialista
    )[0];

    if (idEspecialista && this.usuario) {
      try {
        this.turnosService.guardarTurno(
          idEspecialista,
          this.usuario.id,
          this.especialidadElegida,
          this.formatearFecha(),
          turno
        );
        Swal.fire({
          icon: 'success',
          title: 'Turno agendado',
          text: `Fecha: ${this.fechaSeleccionada} - ${turno}hs.`,
        });
        this.resetearVariables();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'No pudimos agendar el turno',
          text: error,
        });
      }
    }
  }

  resetearVariables() {
    this.profesionalElegido = undefined;
    this.especialidadElegida = '';
    this.horariosFiltrados = undefined;
    this.proximasFechasDeAtencion = undefined;
    this.fechaSeleccionada = undefined;
    this.turnosAMostrar = [];
  }

  ngOnDestroy(): void {
    this.subHorarios?.unsubscribe();
  }
}
