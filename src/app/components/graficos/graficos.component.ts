import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { TurnosService } from '../../services/turnos.service';
import { SpinnerDirective } from '../../directives/spinner.directive';
import { AuthService } from '../../services/auth.service';
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


  turnos: any[] = [];
  espeCan: { especialidad: string; cantidad: number }[] = [];
  labelData: string[] = [];
  realData: number[] = [];
  colorData: any[] = [];
  sub?: Subscription;

  constructor (
    private authService: AuthService,
    private turnosService: TurnosService
  ) {

  }

  ngOnInit(): void {
    // this.sub = this.turnosService.obtenerTodosLosTurnos().subscribe((respuesta: any) => {
    //   this.turnos = respuesta;
    //   // this.conseguirCantidades();
    // });

  }

  seleccionarLogs () {
    this.seleccionLogs = true;
    console.log("llamada")
    this.isLoading = true;
    this.subLogsListado = this.authService.obtenerLogsUsuarios().subscribe((respuesta) =>{
      this.logsListado = respuesta;
      this.isLoading = false;
    });

  }

  exportAsExcel(fileName: string): void {
    let encabezados = Object.keys(this.logsListado[0]);

    const datosConvertidos = this.logsListado.map((dato) => ({
      ...dato,
      especialidades: Array.isArray(dato.especialidades) ? dato.especialidades.join(', ') : dato.especialidades,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet, [encabezados], {
      origin: 'A1',
    });
    XLSX.utils.sheet_add_json(worksheet, datosConvertidos, {
      origin: 'A2',
      skipHeader: true,
    });

    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.guardarArchivoXLS(excelBuffer, fileName);
  }

  private guardarArchivoXLS(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, `${fileName}.xlsx`);
  }

  // conseguirCantidades() {
  //   this.espeCan = this.turnos.reduce<{ especialidad: string; cantidad: number }[]>((acc, turno) => {
  //     const especialidadExistente = acc.find(item => item.especialidad === turno.especialidad);
  //     if (especialidadExistente) {
  //       especialidadExistente.cantidad++;
  //     } else {
  //       acc.push({ especialidad: turno.especialidad, cantidad: 1 });
  //     }
  //     return acc;
  //   }, []);

  //   if (this.espeCan !== null) {
  //     this.espeCan.map(o => {
  //       this.labelData.push(o.especialidad);
  //       this.realData.push(o.cantidad);
  //     })
  //   }
  //   this.cargarDatos(this.labelData, this.realData);
  // }

  // cargarDatos(labelData: any, valuedata: any) {
  //   const mychar = new Chart('barchart', {
  //     type: 'bar',
  //     data: {
  //       labels: labelData,
  //       datasets: [
  //         {
  //           label: 'Especialidad',
  //           data: valuedata,
  //           backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
  //           borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
  //           borderWidth: 1
  //         }
  //       ]
  //     },
  //     options: {

  //     }
  //   })
  // }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
