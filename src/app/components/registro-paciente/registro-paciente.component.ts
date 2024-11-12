import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { confirmarClaveValidator } from '../../validators/clave.validator';

import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';

import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-registro-paciente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RecaptchaModule],
  templateUrl: './registro-paciente.component.html',
  styleUrl: './registro-paciente.component.scss',
})
export class RegistroPacienteComponent {
  registroPacienteForm: FormGroup;
  imagenSeleccionada1: string = '';
  imagenSeleccionada2: string = '';
  usuario!: Usuario;
  captchaResponse: string | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {
    this.usuario = {
      id: '',
      nombre: '',
      apellido: '',
      edad: -1,
      dni: -1,
      obraSocial: '',
      especialidades: [],
      tipo: 'paciente',
      verificado: false,
      imagenUno: '',
      imagenDos: '',
    };

    this.registroPacienteForm = new FormGroup(
      {
        nombre: new FormControl('', [
          Validators.pattern('^[a-zA-Z]+$'),
          Validators.required,
        ]),
        apellido: new FormControl('', [
          Validators.pattern('^[a-zA-Z]+$'),
          Validators.required,
        ]),
        edad: new FormControl('0', [
          Validators.required,
          Validators.min(0),
          Validators.max(99),
        ]),
        dni: new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]{1,8}$'),
          Validators.required,
        ]),
        obraSocial: new FormControl('', [
          Validators.pattern('^[a-zA-Z]+$'),
          Validators.required,
        ]),
        email: new FormControl('', [Validators.email, Validators.required]),
        clave: new FormControl('', [
          Validators.minLength(8),
          Validators.required,
        ]),
        repiteClave: new FormControl('', [
          Validators.minLength(8),
          Validators.required,
        ]),
      },
      confirmarClaveValidator()
    );
  }

  generarStringRandom(longitud: number) {
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resultado = '';
    for (let i = 0; i < longitud; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      resultado += caracteres[indice];
    }
    return resultado;
  }

  async onFileSelected(event: Event, guardaren: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const randomString = this.generarStringRandom(8);
      const publicUrl = await this.supabaseService.uploadProfileImage(
        file,
        randomString
      );
      if (publicUrl) {
        if (guardaren == 1) {
          this.imagenSeleccionada1 = publicUrl;
        } else {
          this.imagenSeleccionada2 = publicUrl;
        }
      } else {
        console.error('No se pudo subir la imagen');
      }
    }
  }

  resetearFilesYCaptcha() {
    const imagenUno = document.getElementById(
      'imagenPacienteUno'
    ) as HTMLInputElement;
    const imagenDos = document.getElementById(
      'imagenPacienteDos'
    ) as HTMLInputElement;
    if (imagenUno) {
      imagenUno.value = ''; // Resetea el valor del input
    }
    if (imagenDos) {
      imagenDos.value = ''; // Resetea el valor del input
    }
  }

  registrarUsuario() {
    if (this.registroPacienteForm.valid) {
      console.log('Formulario válido:', this.registroPacienteForm.value);
      this.usuario.nombre =
        this.registroPacienteForm.get('nombre')?.value || '';
      this.usuario.apellido =
        this.registroPacienteForm.get('apellido')?.value || '';
      this.usuario.edad = this.registroPacienteForm.get('edad')?.value || '';
      this.usuario.dni = this.registroPacienteForm.get('dni')?.value || '';
      this.usuario.obraSocial =
        this.registroPacienteForm.get('obraSocial')?.value || '';
      this.usuario.especialidades = [];
      this.usuario.tipo = 'paciente';
      this.usuario.verificado = true;
      this.usuario.imagenUno = this.imagenSeleccionada1;
      this.usuario.imagenDos = this.imagenSeleccionada2;

      this.authService.crearUsuario(
        this.registroPacienteForm.get('email')?.value || '',
        this.registroPacienteForm.get('repiteClave')?.value || '',
        this.usuario
      );

      //mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: 'Registrado',
        text: 'Verifica tu correo electrónico para poder continuar.',
      });

      //Reset del form
      this.registroPacienteForm.reset();
      this.resetearFilesYCaptcha();
    } else {
      console.log('Formulario no válido');
      this.registroPacienteForm.markAllAsTouched();
    }
  }

  resolved(captchaResponse: string | null) {
    this.captchaResponse = captchaResponse;
  }
}
