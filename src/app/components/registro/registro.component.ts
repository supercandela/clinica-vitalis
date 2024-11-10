import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  constructor (
    private router: Router
  ) {

  }

  irARegistroPaciente() {
    this.router.navigateByUrl('/registro-paciente');
  }

  irARegistroEspecialista() {
    this.router.navigateByUrl('/registro-especialista');
  }
}
