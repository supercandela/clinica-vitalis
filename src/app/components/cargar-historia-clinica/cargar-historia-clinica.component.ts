import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderEspecialistaComponent } from '../header-especialista/header-especialista.component';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  Validators,
  FormArray,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';

import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { TurnosService } from '../../services/turnos.service';

@Component({
  selector: 'app-cargar-historia-clinica',
  standalone: true,
  imports: [
    HeaderEspecialistaComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './cargar-historia-clinica.component.html',
  styleUrl: './cargar-historia-clinica.component.scss',
})
export class CargarHistoriaClinicaComponent implements OnInit {
  usuario!: Usuario;
  historiaClinicaForm: FormGroup;
  turnoId?: string;
  resena: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private turnosService: TurnosService,
    private router: Router
  ) {
    this.historiaClinicaForm = new FormGroup({
      altura: new FormControl('15', [
        Validators.required,
        Validators.min(15),
        Validators.max(250),
      ]),
      peso: new FormControl('5', [
        Validators.required,
        Validators.min(0),
        Validators.max(400),
      ]),
      temperatura: new FormControl('36', [
        Validators.required,
        Validators.min(32),
        Validators.max(50),
      ]),
      presion: new FormControl('', [Validators.required]),
      campoDinamicoClave1: new FormControl('', [Validators.required]),
      campoDinamicoValor1: new FormControl('', [Validators.required]),
      campoDinamicoClave2: new FormControl('', [Validators.required]),
      campoDinamicoValor2: new FormControl('', [Validators.required]),
      campoDinamicoClave3: new FormControl('', [Validators.required]),
      campoDinamicoValor3: new FormControl('', [Validators.required]),
      campoDinamicoClave4: new FormControl('', [Validators.required]),
      campoDinamicoValor4: new FormControl('', [Validators.required]),
      campoDinamicoClave6: new FormControl('', [Validators.required]),
      campoDinamicoValor6: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.usuario = this.authService.usuarioActual;
    this.turnoId = this.route.snapshot.paramMap.get('turnoId') || '';
  }

  async finalizarTurno() {
    let clave1 =
      this.historiaClinicaForm.get('campoDinamicoClave1')?.value || '';
    let valor1 =
      this.historiaClinicaForm.get('campoDinamicoValor1')?.value || '';
    let clave2 =
      this.historiaClinicaForm.get('campoDinamicoClave2')?.value || '';
    let valor2 =
      this.historiaClinicaForm.get('campoDinamicoValor2')?.value || '';
    let clave3 =
      this.historiaClinicaForm.get('campoDinamicoClave3')?.value || '';
    let valor3 =
      this.historiaClinicaForm.get('campoDinamicoValor3')?.value || '';
    let clave4 =
      this.historiaClinicaForm.get('campoDinamicoClave4')?.value || '';
    let valor4 =
      this.historiaClinicaForm.get('campoDinamicoValor4')?.value || '';
    let clave6 =
      this.historiaClinicaForm.get('campoDinamicoClave6')?.value || '';
    let valor6 = this.historiaClinicaForm.get('campoDinamicoValor6')?.value;

    const camposDinamicos = [
      { clave: clave1, valor: valor1 },
      { clave: clave2, valor: valor2 },
      { clave: clave3, valor: valor3 },
      { clave: clave4, valor: valor4 },
      { clave: clave6, valor: valor6 },
    ];

    let historiaClinica: { [key: string]: any } = {
      altura: this.historiaClinicaForm.get('altura')?.value || '',
      peso: this.historiaClinicaForm.get('peso')?.value || '',
      temperatura: this.historiaClinicaForm.get('temperatura')?.value || '',
      presion: this.historiaClinicaForm.get('presion')?.value || '',
    };

    camposDinamicos.forEach(({ clave, valor }) => {
      historiaClinica[clave] = valor;
    });

    if (this.turnoId && this.resena) {
      try {
        await this.turnosService.finalizarTurno(
          this.turnoId,
          this.resena,
          historiaClinica
        );
        Swal.fire({
          icon: 'success',
          title: 'Turno actualizado',
          text: 'El estado del turno fue actualizado a: Realizado',
        });
        this.router.navigateByUrl('/mis-turnos-especialista');
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Algo salió mal',
          text: error,
        });
      }
    }
  }
}
