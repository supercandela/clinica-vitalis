import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ExpandirBotonDirective } from '../../directives/expandir-boton.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ExpandirBotonDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  quickLoginUsers = [
    { name: 'Admin Candela', profileImage: '../../../assets/Imagenes-para-registro/usuario1.png', email: 'candelaadmin@yopmail.com', password: 'admincandela1234' },
    { name: 'Especialista Roberto', profileImage: '../../../assets/Imagenes-para-registro/usuario2.png', email: 'robertopino@yopmail.com', password: 'roberto1234' },
    { name: 'Especialista Hilda', profileImage: '../../../assets/Imagenes-para-registro/usuario3.png', email: 'hildablanco@yopmail.com', password: 'hilda1234' },
    { name: 'Paciente Candela', profileImage: '../../../assets/Imagenes-para-registro/usuario4.png', email: 'candelabogado@yopmail.com', password: 'candela1234' },
    { name: 'Paciente Micaela', profileImage: '../../../assets/Imagenes-para-registro/usuario5.png', email: 'micaelatouceda@yopmail.com', password: 'micaela1234' },
    { name: 'Paciente Benjamín', profileImage: '../../../assets/Imagenes-para-registro/usuario6.png', email: 'benjaminpereyra@yopmail.com', password: 'benja1234' }
  ];

  constructor (
    private authService: AuthService,
    private router: Router
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

        if (this.authService.usuarioActual?.tipo === 'admin') {
          this.router.navigateByUrl('/usuarios');
        } else if (this.authService.usuarioActual?.tipo === 'especialista') {
          this.router.navigateByUrl('/registro-especialista');
        } else if (this.authService.usuarioActual?.tipo === 'paciente') {
          this.router.navigateByUrl('/registro-paciente');
        }

        console.log('Inicio de sesión exitoso.');
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

  cargarForm(email: string, password: string) {
    this.loginForm.setValue({
      email: email,
      clave: password
    })
  }
}
