import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { confirmarClaveValidator } from '../../validators/clave.validator';

import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-registro-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './registro-admin.component.html',
  styleUrl: './registro-admin.component.scss'
})
export class RegistroAdminComponent {
  registroAdminForm: FormGroup;
  imagenSeleccionada1: string = '';
  imagenSeleccionada2: string = '';
  usuario!: Usuario;

  constructor (
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {

    this.usuario = {
      id: '',
      nombre : '',
      apellido : '',
      edad : -1,
      dni : -1,
      obraSocial : '',
      especialidades : [],
      tipo : 'paciente',
      verificado : false,
      imagenUno : '',
      imagenDos : ''
    }

    this.registroAdminForm = new FormGroup({
      nombre: new FormControl("", [Validators.pattern('^[a-zA-Z]+$'), Validators.required]),
      apellido: new FormControl("", [Validators.pattern('^[a-zA-Z]+$'), Validators.required]),
      edad: new FormControl("0", [Validators.required, Validators.min(0), Validators.max(99)]),
      dni: new FormControl("", [Validators.required, Validators.pattern('^[0-9]{1,8}$'), Validators.required]),
      email: new FormControl("", [Validators.email, Validators.required]),
      clave: new FormControl("", [Validators.minLength(8), Validators.required]),
      repiteClave: new FormControl("", [Validators.minLength(8), Validators.required]),
    }, confirmarClaveValidator());
  }

  generarStringRandom(longitud: number) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
      const publicUrl = await this.supabaseService.uploadProfileImage(file, randomString);
      if (publicUrl) {
        if (guardaren == 1) {
          this.imagenSeleccionada1 = publicUrl;
        }
      } else {
        console.error('No se pudo subir la imagen');
      }
    }
  }
  
  registrarUsuario() {
      if (this.registroAdminForm.valid) {
        console.log('Formulario válido:', this.registroAdminForm.value);
        this.usuario.nombre = this.registroAdminForm.get('nombre')?.value || '';
        this.usuario.apellido = this.registroAdminForm.get('apellido')?.value || '';
        this.usuario.edad = this.registroAdminForm.get('edad')?.value || '';
        this.usuario.dni = this.registroAdminForm.get('dni')?.value || '';
        this.usuario.obraSocial = '';
        this.usuario.especialidades = [];
        this.usuario.tipo = 'admin';
        this.usuario.verificado = true;
        this.usuario.imagenUno = this.imagenSeleccionada1;
        this.usuario.imagenDos = '';

        this.authService.crearUsuario(this.registroAdminForm.get('email')?.value || '', this.registroAdminForm.get('repiteClave')?.value || '', this.usuario);
          
        //mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: 'Registrado',
          text: 'Verifica tu correo electrónico para poder continuar.',
        });

        //Reset del form
        this.registroAdminForm.reset();
      } else {
        console.log('Formulario no válido');
        this.registroAdminForm.markAllAsTouched();
      }
  }
}

