// especialidades.service.ts
import { Injectable } from '@angular/core';

// import {
//   Firestore,
//   addDoc,
//   collection,
//   collectionData,
//   query,
//   orderBy,
// } from '@angular/fire/firestore';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Horario } from '../models/horario.model';

@Injectable({
  providedIn: 'root',
})
export class HorariosService {
  private collectionName = 'horarios';

  constructor(private firestore: AngularFirestore) {}

  obtenerHorarios(idEspecialista: string): Observable<Horario[]> {
    return this.firestore
      .collection(this.collectionName, (ref) =>
        ref.where('idEspecialista', '==', idEspecialista)
      )
      .valueChanges()
      .pipe(
        map((resultados: any[]) => {
          if (resultados.length > 0) {
            const especialista = resultados[0];
            return especialista.horarios || [];
          } else {
            return [];
          }
        })
      );
  }

  guardarHorarios(idEspecialista: string, horarios: Horario[]) {
    const especialistaRef = this.firestore
      .collection(this.collectionName)
      .doc(idEspecialista);

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const doc = await transaction.get(especialistaRef.ref);

      if (!doc.exists) {
        // Si no existe, creamos un nuevo documento con los horarios
        transaction.set(especialistaRef.ref, {
          idEspecialista: idEspecialista,
          horarios: horarios,
        });
      } else {
        // Si ya existe, actualizamos el campo 'horarios'
        transaction.update(especialistaRef.ref, {
          horarios: horarios,
        });
      }
    });
  }
}
