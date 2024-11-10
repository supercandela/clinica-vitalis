import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { confirmarClaveValidator } from '../../validators/clave.validator';

import Swal from 'sweetalert2';
import { SupabaseService } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { EspecialidadesService } from '../../services/especialidades.service';


@Component({
  selector: 'app-registro-especialista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './registro-especialista.component.html',
  styleUrl: './registro-especialista.component.scss'
})
export class RegistroEspecialistaComponent implements OnInit {
  registroEspecialistaForm: FormGroup;
  imagenSeleccionada1: string = '';
  usuario!: Usuario;
  especialidades: any[] = [];
  especialidadesSeleccionadas: string[] = [];

  constructor (
    private supabaseService: SupabaseService,
    private authService: AuthService,
    private especialidadesService: EspecialidadesService
  ) {

    this.usuario = {
      id: '',
      nombre : '',
      apellido : '',
      edad : -1,
      dni : -1,
      obraSocial : '',
      especialidades : [],
      tipo : 'especialista',
      verificado : false,
      imagenUno : '',
      imagenDos : ''
    }

    this.registroEspecialistaForm = new FormGroup({
      nombre: new FormControl("", [Validators.pattern('^[a-zA-Z]+$'), Validators.required]),
      apellido: new FormControl("", [Validators.pattern('^[a-zA-Z]+$'), Validators.required]),
      edad: new FormControl("25", [Validators.required, Validators.min(25), Validators.max(65)]),
      dni: new FormControl("", [Validators.required, Validators.pattern('^[0-9]{1,8}$'), Validators.required]),
      especialidades: new FormControl([]),
      email: new FormControl("", [Validators.email, Validators.required]),
      clave: new FormControl("", [Validators.minLength(8), Validators.required]),
      repiteClave: new FormControl("", [Validators.minLength(8), Validators.required]),
    }, confirmarClaveValidator());
  }

  ngOnInit(): void {
    this.obtenerEspecialidades();
  }

  obtenerEspecialidades() {
    this.especialidadesService.obtenerEspecialidades().subscribe((data: any) => {
      this.especialidades = data;
    });
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

  onCheckboxChange(event: any, especialidad: string) {
    const especialidadesArray: FormControl = this.registroEspecialistaForm.get('especialidades') as FormControl;

    if (event.target.checked) {
      this.especialidadesSeleccionadas.push(especialidad);
    } else {
      const index = this.especialidadesSeleccionadas.indexOf(especialidad);
      if (index > -1) {
        this.especialidadesSeleccionadas.splice(index, 1);
      }
    }

    // Actualiza el valor del control 'especialidades' en el formulario
    especialidadesArray.setValue(this.especialidadesSeleccionadas);
  }
  
  registrarUsuario() {
      if (this.registroEspecialistaForm.valid) {
        console.log('Formulario válido:', this.registroEspecialistaForm.value);
        this.usuario.nombre = this.registroEspecialistaForm.get('nombre')?.value || '';
        this.usuario.apellido = this.registroEspecialistaForm.get('apellido')?.value || '';
        this.usuario.edad = this.registroEspecialistaForm.get('edad')?.value || '';
        this.usuario.dni = this.registroEspecialistaForm.get('dni')?.value || '';
        this.usuario.obraSocial = '';
        this.usuario.especialidades = this.registroEspecialistaForm.get('especialidades')?.value || '';;
        this.usuario.tipo = 'especialista';
        this.usuario.verificado = false;
        this.usuario.imagenUno = this.imagenSeleccionada1;
        this.usuario.imagenDos = '';

        this.authService.crearUsuario(this.registroEspecialistaForm.get('email')?.value || '', this.registroEspecialistaForm.get('repiteClave')?.value || '', this.usuario);
          
        //mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: 'Registrado',
          text: 'Verifica tu correo electrónico para poder continuar.',
        });

        //Reset del form
        this.registroEspecialistaForm.reset();
      } else {
        console.log('Formulario no válido');
        this.registroEspecialistaForm.markAllAsTouched();
      }
  }
}
