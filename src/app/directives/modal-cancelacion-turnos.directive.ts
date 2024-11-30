import { Directive, HostListener, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appCancelModal]',
  standalone: true,
})
export class ModalCancelacionTurnosDirective {
  @Input() onSave!: (comment: string, context: any) => void;
  @Input() context: any;
  @Input() modalMessage: string = 'Ingrese un comentario:';

  constructor(private renderer: Renderer2) {}

  @HostListener('click')
  openModal() {
    const modal = this.createModal();
    this.renderer.appendChild(document.body, modal);
  }

  private createModal(): HTMLElement {
    const modal = this.renderer.createElement('div');
    this.renderer.addClass(modal, 'custom-modal-overlay');

    const modalContent = `
      <div class="custom-modal">
        <div class="custom-modal-header">
          <h5>${this.modalMessage}</h5>
          <button class="close-btn">&times;</button>
        </div>
        <div class="custom-modal-body">
          <textarea class="custom-textarea" placeholder="Escriba su comentario aquí..."></textarea>
        </div>
        <div class="custom-modal-footer">
          <button class="custom-btn save-btn">Aceptar</button>
          <button class="custom-btn cancel-btn">Cancelar</button>
        </div>
      </div>
    `;
    modal.innerHTML = modalContent;

    const textarea = modal.querySelector('textarea') as HTMLTextAreaElement;
    const closeBtn = modal.querySelector('.close-btn') as HTMLButtonElement;
    const saveBtn = modal.querySelector('.save-btn') as HTMLButtonElement;
    const cancelBtn = modal.querySelector('.cancel-btn') as HTMLButtonElement;

    const closeModal = () => this.renderer.removeChild(document.body, modal);

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    saveBtn.addEventListener('click', () => {
      if (this.onSave) {
        this.onSave(textarea.value, this.context);
      }
      closeModal();
    });

    return modal;
  }
}
