export class persona{
    id?: number;
    nombre: String;
    apellido: String;
    img: String;
    descripcion: String;
    banner: String;

    constructor(nombre: String, apellido: String, img:String, descripcion:String, banner:String){
        this.nombre = nombre;
        this.apellido = apellido;
        this.img = img;
        this.descripcion = descripcion;
        this.banner = banner;
    }
}