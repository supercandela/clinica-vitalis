import { Injectable } from '@angular/core';

import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from '@angular/fire/firestore';
import { addDoc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Turno } from '../models/turno.model';
import { from, Observable } from 'rxjs';

export enum EstadoTurno {
  pendiente = 'Pendiente',
  aceptado = 'Aceptado',
  realizado = 'Realizado',
  rechazado = 'Rechazado',
  cancelado = 'Cancelado',
}

@Injectable({
  providedIn: 'root',
})
export class TurnosService {
  private collectionName = 'turnos';

  constructor(
    private angularFirestore: AngularFirestore,
    private firestore: Firestore
  ) {}

  guardarTurno(
    especialistaId: string,
    pacienteId: string,
    especialidad: string,
    fecha: string,
    hora: string
  ) {
    const fechaCompleta = new Date(`${fecha}T${hora}`);
    const fechaTimestamp = Timestamp.fromDate(fechaCompleta);

    const turno = {
      especialistaId,
      pacienteId,
      especialidad,
      fecha: fechaTimestamp,
      hora,
      estado: EstadoTurno.pendiente,
      comentarioCancelacion: '',
      calificaAtencion: '',
      resena: '',
    };

    const turnosCollection = this.angularFirestore.collection(
      this.collectionName
    );
    turnosCollection
      .add(turno)
      .then(() => {
        console.log('Turno guardado exitosamente.');
      })
      .catch((error) => {
        console.error('Error al guardar el turno:', error);
      });
  }

  async obtenerTurnosPorDia(
    idEspecialista: string,
    especialidad: string,
    fecha: string
  ) {
    const horaInicio = '00:00';
    const fechaInicio = new Date(`${fecha}T${horaInicio}`);
    const horaFin = '23:59';
    const fechaFin = new Date(`${fecha}T${horaFin}`);

    const timestampInicio = Timestamp.fromDate(fechaInicio);
    const timestampFin = Timestamp.fromDate(fechaFin);
    console.log(timestampInicio, timestampFin);

    const turnosRef = collection(this.firestore, this.collectionName);

    const q = query(
      turnosRef,
      where('especialistaId', '==', idEspecialista),
      where('especialidad', '==', especialidad),
      where('fecha', '>=', timestampInicio),
      where('fecha', '<=', timestampFin)
    );

    try {
      const querySnapshot = await getDocs(q);

      const turnos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return turnos as Turno[];
    } catch (error) {
      console.error('Error al obtener los turnos:', error);
      return [];
    }
  }

  obtenerTodosLosTurnos(): Observable<any[]> {
    const turnosRef = collection(this.firestore, this.collectionName);

    return from(
      getDocs(turnosRef).then((querySnapshot) => {
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      })
    );
  }

  obtenerTurnosConUsuario(
    campoABuscar: string,
    valorABuscar: string,
    campoUsuario: 'especialistaId' | 'pacienteId'
  ): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      try {
        const turnosRef = collection(this.firestore, this.collectionName);
        const q = query(turnosRef, where(campoABuscar, '==', valorABuscar));

        const unsubscribe = onSnapshot(
          q,
          async (querySnapshot) => {
            try {
              const turnos = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as Turno[];

              const turnosConUsuarios = await Promise.all(
                turnos.map(async (turno) => {
                  const usuarioId = turno[campoUsuario];

                  if (!usuarioId) {
                    return { ...turno, usuario: null };
                  }

                  const usuarioRef = doc(
                    collection(this.firestore, 'usuarios'),
                    usuarioId
                  );
                  const usuarioSnap = await getDoc(usuarioRef);

                  if (!usuarioSnap.exists()) {
                    return { ...turno, usuario: null };
                  }

                  const usuarioData = usuarioSnap.data();
                  return {
                    ...turno,
                    usuario: { id: usuarioSnap.id, ...usuarioData },
                  };
                })
              );

              observer.next(turnosConUsuarios);
            } catch (error) {
              observer.error(
                'Error al enriquecer los turnos con los datos del usuario.'
              );
            }
          },
          (error) => {
            observer.error('Error al obtener los turnos.');
          }
        );
      } catch (error) {
        observer.error('Error al inicializar la consulta de turnos.');
      }
    });
  }

  async cambiarEstadoTurnoPorId(
    turnoId: string,
    nuevoEstado: string,
    comentarioCancelacion: string
  ) {
    try {
      const turnoDocRef = doc(this.firestore, this.collectionName, turnoId);
      await updateDoc(turnoDocRef, {
        estado: nuevoEstado,
        comentarioCancelacion: comentarioCancelacion,
      });
      return 'Estado del turno actualizado con éxito';
    } catch (error) {
      return error;
    }
  }

  async finalizarTurno(turnoId: string, resena: string, historiaClinica: any) {
    try {
      const turnoDocRef = doc(this.firestore, this.collectionName, turnoId);
      await updateDoc(turnoDocRef, {
        estado: EstadoTurno.realizado,
        resena: resena,
        historiaClinica: historiaClinica,
      });
      return 'Estado del turno actualizado con éxito';
    } catch (error) {
      return error;
    }
  }

  async calificarTurno(turnoId: string, calificacion: string) {
    try {
      const turnoDocRef = doc(this.firestore, this.collectionName, turnoId);
      await updateDoc(turnoDocRef, {
        calificaAtencion: calificacion,
      });
      return 'Calificación guardada con éxito.';
    } catch (error) {
      return error;
    }
  }

  async guardarEncuesta(
    turnoId: string,
    demora: number,
    instalaciones: string,
    satisfaccion: string
  ) {
    try {
      const turnoDocRef = doc(this.firestore, this.collectionName, turnoId);
      await updateDoc(turnoDocRef, {
        encuestaCompletada: true,
      });

      const encuestaData = {
        turnoId,
        demora,
        instalaciones,
        satisfaccion,
      };

      const encuestasCollectionRef = collection(this.firestore, 'encuestas');
      await addDoc(encuestasCollectionRef, encuestaData);

      return 'Encuesta guardada con éxito.';
    } catch (error) {
      return error;
    }
  }

  obtenerTurnosConEspecialistaYPaciente(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      try {
        const turnosRef = collection(this.firestore, this.collectionName);
  
        const unsubscribe = onSnapshot(
          turnosRef,
          async (querySnapshot) => {
            try {
              const turnos = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as Turno[];
  
              const turnosConUsuarios = await Promise.all(
                turnos.map(async (turno) => {
                  const especialistaRef = doc(
                    collection(this.firestore, 'usuarios'),
                    turno.especialistaId
                  );
                  const especialistaSnap = await getDoc(especialistaRef);
                  const especialistaData = especialistaSnap.exists()
                    ? { id: especialistaSnap.id, ...especialistaSnap.data() }
                    : null;
  
                  const pacienteRef = doc(
                    collection(this.firestore, 'usuarios'),
                    turno.pacienteId
                  );
                  const pacienteSnap = await getDoc(pacienteRef);
                  const pacienteData = pacienteSnap.exists()
                    ? { id: pacienteSnap.id, ...pacienteSnap.data() }
                    : null;
  
                  return {
                    ...turno,
                    especialista: especialistaData,
                    paciente: pacienteData,
                  };
                })
              );
  
              observer.next(turnosConUsuarios);
            } catch (error) {
              observer.error(
                'Error al enriquecer los turnos con los datos de usuarios.'
              );
            }
          },
          (error) => {
            observer.error('Error al obtener los turnos.');
          }
        );
      } catch (error) {
        observer.error('Error al inicializar la consulta de turnos.');
      }
    });
  }
}
