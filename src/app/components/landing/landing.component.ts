import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  plans = [
    { name: 'Plan Básico', description: 'Consultas generales y servicios básicos.', price: '$300/mes' },
    { name: 'Plan Familiar', description: 'Cobertura para hasta 4 miembros de la familia.', price: '$500/mes' },
    { name: 'Plan Premium', description: 'Atención prioritaria y acceso a todas las especialidades.', price: '$800/mes' }
  ];

  constructor (
    private router: Router
  ) {

  }

  irALogin () {
    this.router.navigateByUrl('/login');
  }

  irARegistro () {
    this.router.navigateByUrl('/registro');
  }
}
