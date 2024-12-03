import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";

import { AuthService } from '../../services/auth.service';
import { SpinnerDirective } from '../../directives/spinner.directive';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

import { TurnosService } from '../../services/turnos.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [HeaderComponent, CommonModule, SpinnerDirective ],
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
  labelData: string[] = [];
  realData: number[] = [];
  colorData: any[] = [];

  turnosPorDia: boolean = false;
  turnosPorDiaListado: any[] = [];
  subTurnosPorDia?: Subscription;
  diaCan: { dia: string; cantidad: number }[] = [];
  realDataPorDia: any[] = [];

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
        this.labelData.push(o.especialidad);
        this.realData.push(o.cantidad);
      })
    }
    console.log(this.labelData, this.realData);
    this.cargarDatos(this.labelData, this.realData);
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

    this.labelData = Object.keys(this.diaCan);
    this.realDataPorDia = Object.values(this.diaCan);
    console.log(this.labelData, this.realDataPorDia);
    this.cargarDatosPieChart(this.labelData, this.realData, 'piechart', 'doughnut');
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

  ngOnDestroy(): void {
    this.subLogsListado?.unsubscribe();
    this.subTurnosPorEspecialidad?.unsubscribe();
    this.subTurnosPorDia?.unsubscribe();
  }
}
