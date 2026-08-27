export class NuevoUsuario {
    nombre!: string;
    nombreUsuario!: string;
    email!: string;
    password!: string;
    roles: string[] = ['user'];
    authorities?: string[];
    codigoAdmin?: string;

    constructor(
        nombre: string,
        nombreUsuario: string,
        email: string,
        password: string,
        roles: string[] = ['user'],
        codigoAdmin?: string
    ) {
        this.nombre = nombre;
        this.nombreUsuario = nombreUsuario;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.authorities = roles;
        if (codigoAdmin) {
            this.codigoAdmin = codigoAdmin;
        }
    }
}
