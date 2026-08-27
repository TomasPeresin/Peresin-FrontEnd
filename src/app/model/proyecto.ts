export class Proyecto {
    id?: number;
    nombre: string;
    descripcion: string;
    fecha: number;
    link: string;
    img?: string;
    categorias?: string;

    constructor(nombre: string, descripcion: string, fecha: number, link: string, img?: string, categorias?: string) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.link = link;
        this.img = img;
        this.categorias = categorias;
    }
}
