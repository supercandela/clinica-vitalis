import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario.model';
import { UsuariosService } from '../../services/usuarios.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent implements OnInit, OnDestroy {
  usuarios: Usuario[] = [];
  sub?: Subscription;
  usuarioActual?: Usuario;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.sub = this.usuariosService
      .obtenerUsuarios()
      .subscribe((respuesta: any) => {
        this.usuarios = respuesta;
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

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}