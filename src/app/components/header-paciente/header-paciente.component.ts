import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header-paciente',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header-paciente.component.html',
  styleUrl: './header-paciente.component.scss'
})
export class HeaderPacienteComponent implements OnInit {
  usuario?: Usuario;
  

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.usuario = this.authService.usuarioActual;
  }

  irALogin() {
    this.router.navigateByUrl('/login');
  }

  cerrarSesion (){
    // this.authService.logout();
    // this.router.navigateByUrl('login');
  }
}
