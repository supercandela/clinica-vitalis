import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ExpandirBotonDirective } from '../../directives/expandir-boton.directive';
import { SpinnerDirective } from '../../directives/spinner.directive';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ExpandirBotonDirective, SpinnerDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false;
  loginForm: FormGroup;
  quickLoginUsers = [
    { name: 'Admin Candela', profileImage: '../../../assets/Imagenes-para-registro/usuario9.png', email: 'candelaadmin@yopmail.com', password: 'admincandela1234' },
    { name: 'Especialista Roberto', profileImage: '../../../assets/Imagenes-para-registro/usuario15.png', email: 'robertopino@yopmail.com', password: 'roberto1234' },
    { name: 'Especialista Hilda', profileImage: '../../../assets/Imagenes-para-registro/usuario14.png', email: 'hildablanco@yopmail.com', password: 'hilda1234' },
    { name: 'Paciente Candela', profileImage: '../../../assets/Imagenes-para-registro/usuario1.png', email: 'candelabogado@yopmail.com', password: 'candela1234' },
    { name: 'Paciente Micaela', profileImage: '../../../assets/Imagenes-para-registro/usuario4.png', email: 'micaelatouceda@yopmail.com', password: 'micaela1234' },
    { name: 'Paciente Benjamín', profileImage: '../../../assets/Imagenes-para-registro/usuario3.png', email: 'benjaminpereyra@yopmail.com', password: 'benja1234' }
  ];

  constructor (
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.email, Validators.required]),
      clave: new FormControl("", [Validators.required])
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.quickLoginUsers = [
        { name: 'Admin Candela', profileImage: '../../../assets/Imagenes-para-registro/usuario9.png', email: 'candelaadmin@yopmail.com', password: 'admincandela1234' },
        { name: 'Especialista Roberto', profileImage: '../../../assets/Imagenes-para-registro/usuario15.png', email: 'robertopino@yopmail.com', password: 'roberto1234' },
        { name: 'Especialista Hilda', profileImage: '../../../assets/Imagenes-para-registro/usuario14.png', email: 'hildablanco@yopmail.com', password: 'hilda1234' },
        { name: 'Paciente Candela', profileImage: '../../../assets/Imagenes-para-registro/usuario1.png', email: 'candelabogado@yopmail.com', password: 'candela1234' },
        { name: 'Paciente Micaela', profileImage: '../../../assets/Imagenes-para-registro/usuario4.png', email: 'micaelatouceda@yopmail.com', password: 'micaela1234' },
        { name: 'Paciente Benjamín', profileImage: '../../../assets/Imagenes-para-registro/usuario3.png', email: 'benjaminpereyra@yopmail.com', password: 'benja1234' }
      ];
      this.cdr.detectChanges(); 
    }, 1000);
  }

  async ingresarUsuario () {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value || '';
      const clave = this.loginForm.get('clave')?.value || '';
      try {
        this.isLoading = true;
        await this.authService.loginUsuario(email, clave);

        if (this.authService.usuarioActual?.tipo === 'admin') {
          this.router.navigateByUrl('/usuarios');
        } else if (this.authService.usuarioActual?.tipo === 'especialista') {
          this.router.navigateByUrl('/mi-perfil-especialista');
        } else if (this.authService.usuarioActual?.tipo === 'paciente') {
          this.router.navigateByUrl('/mi-perfil-paciente');
        }

        console.log('Inicio de sesión exitoso.');
        this.isLoading = false;
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Algo salió mal',
          text: error,
        });
        this.isLoading = false;
      }
    } else {
      console.log('Formulario no válido');
      this.loginForm.markAllAsTouched();
      this.isLoading = false;
    }
  }

  cargarForm(email: string, password: string) {
    this.loginForm.setValue({
      email: email,
      clave: password
    })
  }
}
