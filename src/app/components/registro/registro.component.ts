import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { confirmarClaveValidator } from '../../validators/clave.validator';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  isEspecialista: boolean = false;
  registroPacienteForm: FormGroup;
  registroEspecialistaForm: FormGroup;
  especialidades: string[] = ['Clínica', 'Cardiología', 'Dermatología', 'Pediatría', 'Neurología', 'Odontología'];
  nuevaEspecialidad: string = '';


  constructor (
    private fb: FormBuilder,
    private firestore: Firestore
  ) {
    this.registroPacienteForm = this.fb.group({
      nombre: ["", [Validators.pattern('^[a-zA-Z]+$'), Validators.required]],
      apellido: ["", [Validators.pattern('^[a-zA-Z]+$'), Validators.required]],
      edad: ["0", 
        [Validators.required, Validators.min(0), Validators.max(99)]],
      dni: ["", [Validators.required, Validators.pattern('^[0-9]{1,10}$'), Validators.required]],
      obraSocial: ["", [Validators.pattern('^[a-zA-Z]+$'), Validators.required]],
      email: ["", [Validators.email, Validators.required]],
      clave: ["", [Validators.minLength(8), Validators.required]],
      repiteClave: ["", [Validators.minLength(8), Validators.required]],
    }, confirmarClaveValidator());

    this.registroEspecialistaForm = this.fb.group({
      nombre: ["", [Validators.pattern('^[a-zA-Z]+$'), Validators.required]],
      apellido: ["", [Validators.pattern('^[a-zA-Z]+$'), Validators.required]],
      edad: ["25", [Validators.required, Validators.min(25), Validators.max(65)]],
      dni: ["", [Validators.required, Validators.pattern('^[0-9]{1,10}$'), Validators.required]],
      email: ["", [Validators.email, Validators.required]],
      clave: ["", [Validators.minLength(8), Validators.required]],
      repiteClave: ["", [Validators.minLength(8), Validators.required]],
      especialidades: ['', Validators.required],
      especialidadesSeleccionadas: this.fb.array([])
    }, confirmarClaveValidator());
  }


  seleccionarTipo(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isEspecialista = checkbox.checked;
  }

  get especialidadesSeleccionadas(): FormArray {
    return this.registroEspecialistaForm.get('especialidadesSeleccionadas') as FormArray;
  }

  onCheckboxChange(event: any): void {
    const especialidad = event.target.value;
    if (event.target.checked) {
      this.especialidadesSeleccionadas.push(new FormControl(especialidad));
    } else {
      const index = this.especialidadesSeleccionadas.controls.findIndex(x => x.value === especialidad);
      this.especialidadesSeleccionadas.removeAt(index);
    }
  }

  agregarEspecialidad(): void {
    if (this.nuevaEspecialidad && !this.especialidades.includes(this.nuevaEspecialidad)) {
      this.especialidades.push(this.nuevaEspecialidad);
      this.nuevaEspecialidad = '';
    }
    console.log(this.registroEspecialistaForm.value.especialidadesSeleccionadas);
  }
  
  registrarUsuario() {
    // if (this.encuestaForm.valid) {
    //   console.log('Formulario válido:', this.encuestaForm.value);
    //   let col = collection(this.firestore, 'encuestas');
    //   addDoc(col, {
    //     apellido: this.encuestaForm.value.apellido,
    //     edad: this.encuestaForm.value.edad,
    //     juegoFavorito: this.encuestaForm.value.juegoFavorito,
    //     juegosNuevos: this.encuestaForm.value.juegosNuevos,
    //     nombre: this.encuestaForm.value.nombre,
    //     recomendar: this.encuestaForm.value.recomendar,
    //     telefono: this.encuestaForm.value.telefono,
    //   });
    //   Swal.fire({
    //     icon: 'success',
    //     title: '¡Gracias!',
    //     text: 'Tus opiniones nos ayudan a seguir creciendo.',
    //   });
    //   this.encuestaForm.reset({edad: 18});
    // } else {
    //   console.log('Formulario no válido');
    //   this.encuestaForm.markAllAsTouched();
    // }
  }

  get pacienteNombre() {
    return this.registroPacienteForm.get('nombre');
  }

  get pacienteApellido() {
    return this.registroPacienteForm.get('apellido');
  }

  get pacienteEdad() {
    return this.registroPacienteForm.get('edad');
  }

  get pacienteDni() {
    return this.registroPacienteForm.get('dni');
  }

  get pacienteObraSocial() {
    return this.registroPacienteForm.get('obraSocial');
  }

  get pacienteEmail() {
    return this.registroPacienteForm.get('email');
  }

  get pacienteClave() {
    return this.registroPacienteForm.get('clave');
  }

  get pacienteRepiteClave() {
    return this.registroPacienteForm.get('repiteClave');
  }


}
