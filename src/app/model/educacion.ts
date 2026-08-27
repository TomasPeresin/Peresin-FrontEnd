export class Educacion {
    id?: number;
    institucionE: String;
    tituloE: String;
    estadoE: String;
    fechaInicio: number;
    fechaFin: number;

    constructor(institucion: String, titulo: String, estado: String, fechaIni: number, fechaFin: number) {
        this.institucionE = institucion;
        this.tituloE = titulo;
        this.estadoE = estado;
        this.fechaInicio = fechaIni;
        this.fechaFin = fechaFin;
    }
}
