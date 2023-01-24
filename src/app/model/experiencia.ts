export class Experiencia {
    id?: number;
    nombreE: String;
    descripcionE: String;
    fechaInicio: number;
    fechaFin: number;

    constructor(nombreE: String, descripcionE: String, fechaIni: number, fechaFin: number) {
        this.nombreE = nombreE;
        this.descripcionE = descripcionE;
        this.fechaInicio = fechaIni;
        this.fechaFin = fechaFin;
    }
}
