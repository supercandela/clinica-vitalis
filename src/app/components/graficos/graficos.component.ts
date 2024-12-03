import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";

import { AuthService } from '../../services/auth.service';
import { SpinnerDirective } from '../../directives/spinner.directive';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

import { TurnosService } from '../../services/turnos.service';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
Chart.register(...registerables);

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [HeaderComponent, CommonModule, SpinnerDirective, FormsModule],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.scss'
})

export class GraficosComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;

  seleccionLogs: boolean = false;
  subLogsListado?: Subscription;
  logsListado: any[] = [];

  turnosPorEspecialidad: boolean = false;
  turnosPorEspecialidadListado: any[] = [];
  subTurnosPorEspecialidad?: Subscription;
  espeCan: { especialidad: string; cantidad: number }[] = [];
  labelDataTurnosEspecialidad: string[] = [];
  realDataTurnosEspecialidad: number[] = [];
  colorDataTurnosEspecialidad: any[] = [];

  turnosPorDia: boolean = false;
  turnosPorDiaListado: any[] = [];
  subTurnosPorDia?: Subscription;
  diaCan: { dia: string; cantidad: number }[] = [];
  labelDataTurnosPorDia: string[] = [];
  realDataTurnosPorDia: any[] = [];
  colorDataTurnosPorDia: any[] = [];

  turnosSolicitadosPorMedico: boolean = false;
  subTurnosSolicitadosPorMedico?: Subscription;
  turnosSolicitadosPorMedicoListado: any[] = [];
  labelDataTurnosPorMedico: string[] = [];
  realDataTurnosPorMedico: any[] = [];
  colorDataTurnosPorMedico: any[] = [];

  cantidadesPorDia: { especialista: string; cantidad: number }[] = [];
  fecha_desde!: string;
  fecha_hasta!: string;
  turnosFiltrados!: any[];
  mensaje: string = "";
  turnosMap!: any[];
  chart: Chart | null = null;
  canvaCreado: boolean = false;
  estadoSolicitado!: string;
  enterLeave = signal(true);
  isOpen = signal(false);



  constructor (
    private authService: AuthService,
    private turnosService: TurnosService
  ) {

  }

  ngOnInit(): void {

  }

  seleccionarLogs () {
    this.seleccionLogs = true;
    this.turnosPorEspecialidad = false;
    this.turnosPorDia = false;
    this.turnosSolicitadosPorMedico = false;

    this.isLoading = true;
    this.subLogsListado = this.authService.obtenerLogsUsuarios().subscribe((respuesta) =>{
      this.logsListado = respuesta;
      this.isLoading = false;
    });
  }

  exportAsExcel(): void {
    const tabla = document.getElementById('tabla-logs-completa');
    if (tabla) {
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tabla);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Logs');
      XLSX.writeFile(wb, 'logs-usuarios.xlsx');
    }
  }

  seleccionarTurnosPorEspecialidad () {
    this.seleccionLogs = false;
    this.turnosPorEspecialidad = true;
    this.turnosPorDia = false;
    this.turnosSolicitadosPorMedico = false;

    this.isLoading = true;
    this.subTurnosPorEspecialidad = this.turnosService.obtenerTodosLosTurnos().subscribe((respuesta: any) => {
      this.turnosPorEspecialidadListado = respuesta;
      this.conseguirCantidades();
      this.isLoading = false;
    });
  }

  conseguirCantidades() {
    this.espeCan = this.turnosPorEspecialidadListado.reduce<{ especialidad: string; cantidad: number }[]>((acc, turno) => {
      const especialidadExistente = acc.find(item => item.especialidad === turno.especialidad);
      if (especialidadExistente) {
        especialidadExistente.cantidad++;
      } else {
        acc.push({ especialidad: turno.especialidad, cantidad: 1 });
      }
      return acc;
    }, []);

    if (this.espeCan !== null) {
      this.espeCan.map(o => {
        this.labelDataTurnosEspecialidad.push(o.especialidad);
        this.realDataTurnosEspecialidad.push(o.cantidad);
      })
    }
    this.cargarDatos(this.labelDataTurnosEspecialidad, this.realDataTurnosEspecialidad);
  }

  cargarDatos(labelData: any, valuedata: any) {
    const mychar = new Chart('barchart', {
      type: 'bar',
      data: {
        labels: labelData,
        datasets: [
          {
            label: 'Especialidad',
            data: valuedata,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            borderWidth: 1
          }
        ]
      },
      options: {

      }
    })
  }

  seleccionarTurnosPorDia () {
    this.seleccionLogs = false;
    this.turnosPorEspecialidad = false;
    this.turnosPorDia = true;
    this.turnosSolicitadosPorMedico = false;

    this.isLoading = true;
    this.subTurnosPorDia = this.turnosService.obtenerTodosLosTurnos().subscribe((respuesta: any) => {
      this.turnosPorDiaListado = respuesta;
      this.conseguirCantidadesPorDia();
      this.isLoading = false;
    });
  }

  conseguirCantidadesPorDia() {
    this.diaCan = this.turnosPorDiaListado.reduce((contador, turno) => {
      const fechaTurno = new Date(turno.fecha.seconds * 1000).toISOString().split('T')[0];
      contador[fechaTurno] = (contador[fechaTurno] || 0) + 1;
      return contador;
    }, {} as { [fecha: string]: number });

    this.labelDataTurnosPorDia = Object.keys(this.diaCan);
    this.realDataTurnosPorDia = Object.values(this.diaCan);
    this.cargarDatosPieChart(this.labelDataTurnosPorDia, this.realDataTurnosPorDia, 'piechart', 'doughnut');
  }

  cargarDatosPieChart(labelData: any, valuedata: any, chartId: string, chartType: any) {
    const mychar = new Chart(chartId, {
      type: chartType,
      data: {
        labels: labelData,
        datasets: [
          {
            label: 'Días',
            data: valuedata,
            backgroundColor: ['#c0392b', '#9b59b6', '#2980b9', '#1abc9c', '#d4ac0d', '#2e4053'],
            borderColor: ['#c0392b', '#9b59b6', '#2980b9', '#1abc9c', '#d4ac0d', '#2e4053'],
            borderWidth: 1
          }
        ]
      },
      options: {

      }
    })
  }

  seleccionarTurnosSolicitadosPorMedico () {
    this.seleccionLogs = false;
    this.turnosPorEspecialidad = false;
    this.turnosPorDia = false;
    this.turnosSolicitadosPorMedico = true;
    this.estadoSolicitado = '';
    this.isLoading = true;
    this.subTurnosSolicitadosPorMedico = this.turnosService.obtenerTurnosConEspecialistaYPaciente().subscribe((respuesta: any) => {
      this.turnosSolicitadosPorMedicoListado = respuesta;
      this.conseguirCantidadesPorDia();
      this.isLoading = false;
    });
  }




  filtrarTurnos() {
    if (!this.fecha_desde || !this.fecha_hasta) {
      this.mensaje = 'Por favor, selecciona un rango de fechas válido';
      return;
    }

    // Convertir las fechas ingresadas al formato Date
    const desde = new Date(this.fecha_desde);
    const hasta = new Date(this.fecha_hasta);

    if (desde > hasta) {
      this.mensaje = 'La fecha "Desde" no puede ser mayor que la fecha "Hasta"';
      return;
    }

    if (this.estadoSolicitado === 'finalizado') {
      // // Filtrar el array de turnosAll
      // this.turnosFiltrados = this.turnosMap.filter(turno => {
      //   const fechaTurno = this.convertirFecha(turno.fecha); // Convertir la fecha del turno a Date
      //   return (
      //     fechaTurno >= desde &&
      //     fechaTurno <= hasta &&
      //     turno.estado === 'finalizado' // Filtro por estado
      //   );
      // });
    } else {
      this.turnosFiltrados = this.turnosSolicitadosPorMedicoListado.filter(turno => {
        const fechaTurno = turno.fecha.toDate();
        return fechaTurno >= desde && fechaTurno <= hasta;
      });
    }

    this.conseguirCantidadesTurnosPorMedico();
    this.isOpen.set(!this.isOpen());
  }

  conseguirCantidadesTurnosPorMedico() {
    this.cantidadesPorDia = this.turnosFiltrados.reduce((acc, turno) => {
      const idEspecialista = turno.especialistaId;
      acc[idEspecialista] = (acc[idEspecialista] || 0) + 1;
    
      return acc;
    }, {} as Record<string, number>);

    console.log(this.cantidadesPorDia);

    this.labelDataTurnosPorMedico = Object.keys(this.cantidadesPorDia);
    this.realDataTurnosPorMedico = Object.values(this.cantidadesPorDia);
    this.cargarDatosGraficoTurnosPorMedico(this.labelDataTurnosPorMedico, this.realDataTurnosPorMedico, 'turnosPorMedico', 'polarArea');
  }

  cargarDatosGraficoTurnosPorMedico(labelData: any, valuedata: any, chartId: string, chartType: any) {
    if (!this.canvaCreado) {
      const mychar = new Chart(chartId, {
        type: chartType,
        data: {
          labels: labelData,
          datasets: [
            {
              label: 'Turnos',
              data: valuedata,
              backgroundColor: ['#c0392b', '#9b59b6', '#2980b9', '#1abc9c', '#d4ac0d', '#2e4053'],
              borderColor: ['#c0392b', '#9b59b6', '#2980b9', '#1abc9c', '#d4ac0d', '#2e4053'],
              borderWidth: 1
            }
          ]
        },
        options: {

        }
      })
      this.canvaCreado = true;
    }
  }

  limpiarMensaje() {
    this.mensaje = "";
  }

  ngOnDestroy(): void {
    this.subLogsListado?.unsubscribe();
    this.subTurnosPorEspecialidad?.unsubscribe();
    this.subTurnosPorDia?.unsubscribe();
  }
}
