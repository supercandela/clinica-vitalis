import { Injectable } from '@angular/core';

import { Firestore, collection, addDoc, collectionData, query, orderBy, where, getDocs} from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Turno } from '../models/turno.model';
// import { forkJoin, Observable, of } from 'rxjs';
// import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

// import { Horario } from '../models/horario.model';
// import { UsuariosService } from './usuarios.service';

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
    // Convertir la fecha a Timestamp
    const fechaCompleta = new Date(`${fecha}T${hora}`);
    const fechaTimestamp = Timestamp.fromDate(fechaCompleta);

    // Crear el objeto a guardar
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

    // Guardar en la colección "turnos"
    const turnosCollection = this.angularFirestore.collection(this.collectionName);
    turnosCollection
      .add(turno)
      .then(() => {
        console.log('Turno guardado exitosamente.');
      })
      .catch((error) => {
        console.error('Error al guardar el turno:', error);
      });
  }

  async obtenerTurnosPorDia (
    idEspecialista: string,
    especialidad: string,
    fecha: string
  ) {
    // Establecer la fecha inicial (00:00:00) y la fecha final (23:59:59) del día
    const horaInicio = "00:00"; // Hora fija
    const fechaInicio = new Date(`${fecha}T${horaInicio}`);
    const horaFin = "23:59"; // Hora fija
    const fechaFin = new Date(`${fecha}T${horaFin}`);
  
    // Convertir a Timestamp de Firestore
    const timestampInicio = Timestamp.fromDate(fechaInicio);
    const timestampFin = Timestamp.fromDate(fechaFin);
    console.log(timestampInicio, timestampFin);
  
    // Referencia a la colección "turnos"
    const turnosRef = collection(this.firestore, this.collectionName);
  
    // Crear una consulta compuesta con las condiciones necesarias
    const q = query(
      turnosRef,
      where('especialistaId', '==', idEspecialista),
      where('especialidad', '==', especialidad),
      where('fecha', '>=', timestampInicio),
      where('fecha', '<=', timestampFin)
    );
  
    try {
      // Ejecutar la consulta
      const querySnapshot = await getDocs(q);
  
      // Mapear los documentos encontrados a un array
      const turnos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return turnos as Turno[]; // Retorna un array con los turnos encontrados
    } catch (error) {
      console.error('Error al obtener los turnos:', error);
      return [];
    }
  }

  async obtenerTodosLosTurnos() {
    // Referencia a la colección "turnos"
    const turnosRef = collection(this.firestore, 'turnos');
  
    try {
      // Obtener todos los documentos de la colección
      const querySnapshot = await getDocs(turnosRef);
  
      // Mapear los documentos a un array de objetos
      const turnos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      console.log(turnos);
      return turnos; // Retorna un array con todos los registros
    } catch (error) {
      console.error('Error al obtener los turnos:', error);
      return [];
    }
  }
}
