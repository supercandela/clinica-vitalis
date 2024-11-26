import { Timestamp } from "@angular/fire/firestore";
import { EstadoTurno } from "../services/turnos.service"

export class Turno {
    constructor (
        public id: string,
        public especialistaId: string,
        public pacienteId: string,
        public especialidad: string,
        public fecha: Timestamp,
        public hora: string,
        public estado: EstadoTurno,
        public comentarioCancelacion: string,
        public calificaAtencion: string,
        public resena: string
    ) {

    }
}