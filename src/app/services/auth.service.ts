import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioActual!: Usuario;

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}
  
  crearUsuario (email: string, password: string, usuario: Usuario) {

    this.afAuth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
        const uid = userCredential.user?.uid;
        if (uid) {
            this.firestore.collection('usuarios').doc(uid).set({
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              edad: usuario.edad,
              dni: usuario.dni,
              obraSocial: usuario.obraSocial,
              especialidades: usuario.especialidades,
              tipo: usuario.tipo,
              verificado: usuario.verificado,
              imagenUno: usuario.imagenUno,
              imagenDos: usuario.imagenDos
            });
        }
    });
  }

    loginUsuario (email: string, password: string) {
      this.afAuth.signInWithEmailAndPassword(email, password).then((userCredential) => {
        const uid = userCredential.user?.uid;
        if (uid) {
            this.firestore.collection('usuarios').doc(uid).get().subscribe((doc) => {
                if (doc.exists) {
                    // this.usuarioActual = new Usuario(doc.data())
                    console.log("Datos del usuario:", doc.data());
                    // Puedes guardar los datos en una variable para usarlos en la app
                }
            });
        }
    });
  }

}
