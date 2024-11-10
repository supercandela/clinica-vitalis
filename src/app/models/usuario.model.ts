export class Usuario {
    constructor (
        public id: string,
        public nombre: string,
        public apellido: string,
        public edad: number,
        public dni: number,
        public obraSocial: string,
        public especialidades: string[],
        public tipo: string,
        public verificado: boolean,
        public imagenUno: string,
        public imagenDos: string
    ) {

    }
}