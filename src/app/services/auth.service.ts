import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usuarioActual!: Usuario;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  async crearUsuario(email: string, password: string, usuario: Usuario) {
    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      const uid = userCredential.user?.uid;

      if (uid) {
        // Guardar usuario en Firestore con el UID
        await this.firestore.collection('usuarios').doc(uid).set({
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          edad: usuario.edad,
          dni: usuario.dni,
          obraSocial: usuario.obraSocial,
          especialidades: usuario.especialidades,
          tipo: usuario.tipo,
          verificado: usuario.verificado,
          imagenUno: usuario.imagenUno,
          imagenDos: usuario.imagenDos,
        });

        // Enviar verificación de correo
        await this.enviarVerificacionDeCorreo(userCredential.user);
        console.log('Correo de verificación enviado.');
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }

  async enviarVerificacionDeCorreo(user: firebase.User | null): Promise<void> {
    if (user) {
      await user.sendEmailVerification();
    }
  }

  loginUsuario(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.afAuth
        .signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const uid = userCredential.user?.uid;
          if (uid) {
            this.firestore
              .collection('usuarios')
              .doc(uid)
              .get()
              .subscribe(
                (doc) => {
                  if (doc.exists && !userCredential.user?.emailVerified) {
                    reject(
                      new Error('Por favor, verifica tu correo electrónico antes de continuar.')
                    );
                  } else if (doc.exists) {
                    const usuarioData = doc.data() as Usuario; // Asigna los datos al objeto
                    this.usuarioActual = {
                      id: uid,
                      nombre: usuarioData.nombre,
                      apellido: usuarioData.apellido,
                      dni: usuarioData.dni,
                      edad: usuarioData.edad,
                      especialidades: usuarioData.especialidades,
                      imagenDos: usuarioData.imagenDos,
                      imagenUno: usuarioData.imagenUno,
                      obraSocial: usuarioData.obraSocial,
                      tipo: usuarioData.tipo,
                      verificado: usuarioData.verificado
                    };
                    if (!this.usuarioActual.verificado) {
                      reject(new Error('Aún no has sido habilitado para operar.'));
                    }
                    resolve(); // Inicio de sesión exitoso
                  }
                },
                (error) => {
                  reject(error); // Error al obtener los datos del usuario
                }
              );
          } else {
            reject(new Error('No se pudo obtener el UID del usuario.'));
          }
        })
        .catch((error) => {
          let mensaje;
          switch (error.code) {
            case 'auth/weak-password':
              mensaje = 'La clave es muy débil. Debe tener al menos 6 caracteres.';
              break;
            case 'auth/invalid-credential':
              mensaje = 'Usuario o contraseña incorrectos. Verificá tus credenciales.';
              break;
            case 'auth/email-already-in-use':
              mensaje = 'El email ingresado ya está registrado.';
              break;
            case 'auth/invalid-email':
              mensaje = 'El email ingresado no es válido.';
              break;
            default:
              mensaje = error.code;
              break;
          }
          reject(mensaje);
        });
    });
  }

  async logout (): Promise<void> {
    return this.afAuth.signOut().then(() => {
      this.usuarioActual = this.usuarioActual!;
    });
  }
}
