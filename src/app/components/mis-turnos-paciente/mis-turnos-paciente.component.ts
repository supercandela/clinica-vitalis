import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderPacienteComponent } from '../header-paciente/header-paciente.component';
import { EstadoTurno, TurnosService } from '../../services/turnos.service';
import { Usuario } from '../../models/usuario.model';
import { Turno } from '../../models/turno.model';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalCancelacionTurnosDirective } from '../../directives/modal-cancelacion-turnos.directive';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SpinnerDirective } from '../../directives/spinner.directive';
import { EstadoTurnoColorDirective } from '../../directives/estado-turno-color.directive';

@Component({
  selector: 'app-mis-turnos-paciente',
  standalone: true,
  imports: [
    HeaderPacienteComponent,
    CommonModule,
    ModalCancelacionTurnosDirective,
    ReactiveFormsModule,
    SpinnerDirective,
    EstadoTurnoColorDirective
  ],
  templateUrl: './mis-turnos-paciente.component.html',
  styleUrl: './mis-turnos-paciente.component.scss',
})
export class MisTurnosPacienteComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  usuario?: Usuario;
  misTurnos: Turno[] = [];
  misTurnosConDatosEspecialistas: any[] = [];
  sub?: Subscription;
  //Modal Calificacion
  estrellas = Array(5).fill(0);
  calificacionSeleccionada: number = 0;
  turnoSeleccionado: string = '';
  //Modal Encuesta
  encuestaForm: FormGroup;
  nivelesSatisfaccion = [
    'Muy Satisfecho',
    'Satisfecho',
    'Poco Satisfecho',
    'Nada Satisfecho',
  ];
  opcionesInstalaciones = ['Excelentes', 'Buenas', 'Pueden mejorar', 'Malas'];

  constructor(
    private authService: AuthService,
    private turnosService: TurnosService,
    private fb: FormBuilder
  ) {
    this.encuestaForm = this.fb.group({
      demora: [null, [Validators.required, Validators.min(0)]],
      satisfaccion: ['', Validators.required],
      instalaciones: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.usuario = this.authService.usuarioActual;

    this.isLoading = true;
    this.sub = this.turnosService
      .obtenerTurnosConUsuario('pacienteId', this.usuario?.id, 'especialistaId')
      .subscribe((respuesta: any) => {
        this.misTurnosConDatosEspecialistas = respuesta.sort(
          (a: any, b: any) => {
            return b.fecha - a.fecha;
          }
        );
        this.misTurnosConDatosEspecialistas =
          this.misTurnosConDatosEspecialistas.map((turno) => ({
            ...turno,
            resenaEsVisible: false,
          }));
        console.log(this.misTurnosConDatosEspecialistas);
        this.isLoading = false;
      });

    this.handleCancel = this.handleCancel.bind(this);
  }

  async handleCancel(comentario: string, turnoId: any) {
    try {
      await this.cambiarEstadoTurno(turnoId, EstadoTurno.cancelado, comentario);
      Swal.fire({
        icon: 'success',
        title: 'Turno actualizado',
        text: 'El estado del turno fue actualizado a: ' + EstadoTurno.cancelado,
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Algo salió mal',
        text: error,
      });
    }
  }

  async cambiarEstadoTurno(
    turnoId: string,
    nuevoEstado: string,
    comentario: string = ''
  ) {
    (await this.turnosService.cambiarEstadoTurnoPorId(
      turnoId,
      nuevoEstado,
      comentario
    )) as string;
  }

  verResena(turno: any) {
    turno.resenaEsVisible = !turno.resenaEsVisible;
  }

  abrirModalCalificacion(turno: any): void {
    this.turnoSeleccionado = turno;
    this.calificacionSeleccionada = turno.calificacion || 0;
    const modal = new bootstrap.Modal(
      document.getElementById('modalCalificacion')!
    );
    modal.show();
  }

  seleccionarCalificacion(calificacion: number): void {
    this.calificacionSeleccionada = calificacion;
  }

  async guardarCalificacion() {
    if (this.turnoSeleccionado) {
      let calificacionAGuardar = `${this.calificacionSeleccionada}/5`;
      try {
        await this.turnosService.calificarTurno(
          this.turnoSeleccionado,
          calificacionAGuardar
        );
        Swal.fire({
          icon: 'success',
          title: 'Gracias',
          text: 'Con tus opiniones, mejoramos día a día.',
        });
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Algo salió mal',
          text: error,
        });
      }
    }
    const modal = bootstrap.Modal.getInstance(
      document.getElementById('modalCalificacion')!
    );
    modal?.hide();
  }

  abrirModalEncuesta(turnoId: string) {
    this.turnoSeleccionado = turnoId;
    const modal = new bootstrap.Modal(
      document.getElementById('modalEncuesta')!
    );
    modal.show();
  }

  async guardarEncuesta() {
    if (this.encuestaForm.valid) {
      const encuestaData = this.encuestaForm.value;
      if (this.turnoSeleccionado) {
        try {
          await this.turnosService.guardarEncuesta(
            this.turnoSeleccionado,
            encuestaData.demora,
            encuestaData.instalaciones,
            encuestaData.satisfaccion
          );
          Swal.fire({
            icon: 'success',
            title: 'Gracias',
            text: 'Con tus opiniones, mejoramos día a día.',
          });
        } catch (error: any) {
          Swal.fire({
            icon: 'error',
            title: 'Algo salió mal',
            text: error,
          });
        }
      }
      const modal = bootstrap.Modal.getInstance(
        document.getElementById('modalEncuesta')!
      );
      modal?.hide();
    } else {
      console.error('Formulario inválido');
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
