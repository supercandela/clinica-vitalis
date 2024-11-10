import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup

  constructor (
    private authService: AuthService
  ) {

    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.email, Validators.required]),
      clave: new FormControl("", [Validators.required])
    });
  }

  async ingresarUsuario () {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value || '';
      const clave = this.loginForm.get('clave')?.value || '';
      try {
        await this.authService.loginUsuario(email, clave);
        console.log('Inicio de sesión exitoso.');
        // Aquí puedes redirigir al usuario a otra página, si es necesario
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Algo salió mal',
          text: error,
        });
      }
    } else {
      console.log('Formulario no válido');
      this.loginForm.markAllAsTouched();
    }
  }
}
