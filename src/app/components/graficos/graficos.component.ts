import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";

import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { TurnosService } from '../../services/turnos.service';
Chart.register(...registerables);

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [HeaderComponent, CommonModule ],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.scss'
})

export class GraficosComponent implements OnInit, OnDestroy {
  turnos: any[] = [];
  espeCan: { especialidad: string; cantidad: number }[] = [];
  labelData: string[] = [];
  realData: number[] = [];
  colorData: any[] = [];
  sub?: Subscription;

  constructor (
    private turnosService: TurnosService
  ) {

  }

  ngOnInit(): void {
    this.sub = this.turnosService.obtenerTodosLosTurnos().subscribe((respuesta: any) => {
      this.turnos = respuesta;
      this.conseguirCantidades();
    });

  }

  conseguirCantidades() {
    this.espeCan = this.turnos.reduce<{ especialidad: string; cantidad: number }[]>((acc, turno) => {
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

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
