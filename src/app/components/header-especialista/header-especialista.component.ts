import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header-especialista',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header-especialista.component.html',
  styleUrl: './header-especialista.component.scss'
})
export class HeaderEspecialistaComponent implements OnInit {
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

  async cerrarSesion (){
    await this.authService.logout();
    this.router.navigateByUrl('login');
  }
}
