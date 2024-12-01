import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderPacienteComponent } from "../header-paciente/header-paciente.component";
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { AlternarImagenDirective } from '../../directives/alternar-imagen.directive';

// import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mi-perfil-paciente',
  standalone: true,
  imports: [HeaderPacienteComponent, CommonModule, AlternarImagenDirective],
  templateUrl: './mi-perfil-paciente.component.html',
  styleUrl: './mi-perfil-paciente.component.scss'
})
export class MiPerfilPacienteComponent implements OnInit {
  usuario?: Usuario;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.usuarioActual;

  }

}
