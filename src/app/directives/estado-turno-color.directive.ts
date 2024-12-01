import {
  Directive,
  Input,
  Renderer2,
  ElementRef,
  OnChanges,
} from '@angular/core';
import { EstadoTurno } from '../services/turnos.service';

@Directive({
  selector: '[appEstadoTurnoColor]',
  standalone: true,
})
export class EstadoTurnoColorDirective implements OnChanges {
  @Input('appEstadoTurnoColor') estado: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges() {
    this.cambiarColorFondo(this.estado);
  }

  private cambiarColorFondo(estado: string): void {
    let color = '';

    switch (estado) {
      case EstadoTurno.pendiente:
        color = '#1e1e1e66';
        break;
      case EstadoTurno.aceptado:
        color = '#4cbe7c66';
        break;
      case EstadoTurno.cancelado:
        color = '#e6667a66';
        break;
      case EstadoTurno.rechazado:
        color = '#be6c4c66';
        break;
      case EstadoTurno.realizado:
        color = '#f8e1f466';
        break;
      default:
        color = '#1e1e1e66';
        break;
    }

    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }
}
