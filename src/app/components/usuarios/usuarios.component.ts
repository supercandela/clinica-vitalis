import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario.model';
import { UsuariosService } from '../../services/usuarios.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { SpinnerDirective } from '../../directives/spinner.directive';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { TurnosService } from '../../services/turnos.service';
import { CapitalizarPrimeraLetraPipe } from '../../pipes/capitalizar-primera-letra.pipe';
import { BooleanATextoPipe } from '../../pipes/boolean-a-texto.pipe';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [HeaderComponent, CommonModule, SpinnerDirective, CapitalizarPrimeraLetraPipe, BooleanATextoPipe],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent implements OnInit, OnDestroy {
  usuarios: Usuario[] = [];
  sub?: Subscription;
  usuarioActual?: Usuario;
  isLoading: boolean = false;
  subTurnos?: Subscription;
  turnosCompletos: any[] = [];
  listadoPacientesSinRepetir: any[] = [];
  pacienteSeleccionado: any | null = null;
  turnosFiltradosPorPaciente: any[] = [];
  mostrarFab: boolean = false;

  constructor(
    private usuariosService: UsuariosService,
    private turnosService: TurnosService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();

    this.subTurnos = this.turnosService
    .obtenerTurnosConEspecialistaYPaciente()
    .subscribe((respuesta: any) => {
      this.turnosCompletos = respuesta.sort((a: any, b: any) => {
        return b.fecha - a.fecha;
      });
      console.log(this.turnosCompletos);
      this.isLoading = false;
      this.listadoPacientesSinRepetir = this.obtenerDatosUnicosPorPaciente(
        this.turnosCompletos
      );
      console.log(this.listadoPacientesSinRepetir);
    });
  }

  obtenerDatosUnicosPorPaciente(turnos: any[]) {
    const pacientesUnicos: any = {};

    turnos.forEach((turno) => {
      if (!pacientesUnicos[turno.pacienteId]) {
        pacientesUnicos[turno.pacienteId] = turno.paciente;
      }
    });

    return Object.values(pacientesUnicos);
  }

  mostrarDetallesPaciente(paciente: any): void {
    this.pacienteSeleccionado = paciente;
    this.turnosFiltradosPorPaciente = this.turnosCompletos.filter(turno =>
      turno.pacienteId === paciente.id
    );
    console.log(this.turnosFiltradosPorPaciente);
  }

  mostrarUsuarios() {
    this.mostrarFab = !this.mostrarFab;
  }


  obtenerUsuarios() {
    this.isLoading = true;
    this.sub = this.usuariosService
      .obtenerUsuarios()
      .subscribe((respuesta: any) => {
        this.usuarios = respuesta;
        this.isLoading = false;
      });
  }

  toggleVerificado(usuario: Usuario) {
    console.log(usuario);
    usuario.verificado = !usuario.verificado;
    try {
      this.usuariosService.cambiarHabilitacionUsuario(usuario);
      Swal.fire({
        icon: 'success',
        title: 'OK',
        text: 'Usuario actualizado con éxito.',
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Algo salió mal',
        text: 'El usuario no pudo ser actualizado. Vuelve a intentarlo.',
      });
    }
    this.obtenerUsuarios();
  }

  exportAsExcel(fileName: string): void {
    let encabezados = Object.keys(this.usuarios[0]);

    const datosConvertidos = this.usuarios.map((dato) => ({
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

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
