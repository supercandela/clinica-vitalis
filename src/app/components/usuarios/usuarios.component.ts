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

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [HeaderComponent, CommonModule, SpinnerDirective],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent implements OnInit, OnDestroy {
  usuarios: Usuario[] = [];
  sub?: Subscription;
  usuarioActual?: Usuario;
  isLoading: boolean = false;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
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
