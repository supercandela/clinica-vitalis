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

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {

  constructor(
    private firestore: Firestore
) {}

  obtenerEspecialidades() {
    let col = collection(this.firestore, 'especialidades');
    const filteredQuery = query(col, orderBy('nombre', 'asc'));
    const observable = collectionData(filteredQuery);
    return observable;
  }

  agregarEspecialidad(especialidad: string) {
    let col = collection(this.firestore, 'especialidades');
    addDoc(col, { nombre: especialidad});
  }
}
