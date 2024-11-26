// especialidades.service.ts
import { Injectable } from '@angular/core';

import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Usuario } from '../models/usuario.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  constructor(
    private firestore: Firestore,
    private angularFirestore: AngularFirestore
  ) {}

  obtenerUsuarios() {
    let col = collection(this.firestore, 'usuarios');
    const filteredQuery = query(col);
    const observable = collectionData(filteredQuery, { idField: 'id' });
    return observable;
  }

  cambiarHabilitacionUsuario(usuario: Usuario) {
    const usuarioId = usuario.id;
    return this.angularFirestore
      .collection('usuarios')
      .doc(usuarioId)
      .update({ verificado: usuario.verificado })
      .then(() => {
        console.log('Valor de verificado actualizado correctamente.');
      })
      .catch((error) => {
        console.error('Error al actualizar el valor de verificado:', error);
        throw error;
      });
  }

  obtenerUsuarioPorId(id: string): Observable<Usuario> {
    return this.angularFirestore
      .collection<Usuario>('usuarios')
      .doc(id)
      .valueChanges()
      .pipe(
        map((usuario) => {
          if (usuario) {
            usuario = {
              id: id,
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              dni: usuario.dni,
              edad: usuario.edad,
              especialidades: usuario.especialidades,
              imagenDos: usuario.imagenDos,
              imagenUno: usuario.imagenUno,
              obraSocial: usuario.obraSocial,
              tipo: usuario.tipo,
              verificado: usuario.verificado,
            };
            return usuario;
          } else {
            throw new Error(`Usuario con id ${id} no encontrado`);
          }
        })
      );
  }
}
