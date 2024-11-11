import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appExpandirBoton]',
  standalone: true
})
export class ExpandirBotonDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'width', '220px'); // Expande el botón
    this.renderer.setStyle(this.el.nativeElement.querySelector('.user-name'), 'opacity', '1'); // Muestra el nombre
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.setStyle(this.el.nativeElement, 'width', '80px'); // Colapsa el botón
    this.renderer.setStyle(this.el.nativeElement.querySelector('.user-name'), 'opacity', '0'); // Oculta el nombre
  }
}
