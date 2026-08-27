export class Experiencia {
    id?: number;
    nombreE: string;
    descripcionE: string;
    fechaInicio: number;
    fechaFin: number;
    tecnologias?: string;

    constructor(nombreE: string, descripcionE: string, fechaIni: number, fechaFin: number, tecnologias?: string) {
        this.nombreE = nombreE;
        this.descripcionE = descripcionE;
        this.fechaInicio = fechaIni;
        this.fechaFin = fechaFin;
        this.tecnologias = tecnologias;
    }
}
