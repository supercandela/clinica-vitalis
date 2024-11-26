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
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

import { Horario } from '../models/horario.model';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root',
})
export class HorariosService {
  private collectionName = 'horarios';

  constructor(
    private firestore: AngularFirestore,
    private usuariosService: UsuariosService
  ) {}

  obtenerTodosLosHorarios(): Observable<any[]> {
    return this.firestore
      .collection<{ idEspecialista: string; horarios: Horario[] }>('horarios')
      .valueChanges()
      .pipe(
        switchMap((registros) => {
          const peticionesUsuarios = registros.map((registro) =>
            this.usuariosService.obtenerUsuarioPorId(registro.idEspecialista).pipe(
              take(1), // Forzar a que el observable se complete después del primer valor
              map((usuario) => ({
                ...registro,
                usuario,
              })),
              catchError((error) => {
                console.error(`Error obteniendo usuario para id ${registro.idEspecialista}:`, error);
                return of({ ...registro, usuario: null });
              })
            )
          );
          return forkJoin(peticionesUsuarios);
        })
      );
  }
  

  obtenerHorariosPorEspecialista(idEspecialista: string): Observable<Horario[]> {
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
