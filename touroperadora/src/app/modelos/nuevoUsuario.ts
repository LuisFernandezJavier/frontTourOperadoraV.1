export class NuevoUsuario {
    nombreUsuario: string;
    emailUsuario: string;
    passUsuario: string;
    roles: string[];
    constructor(nombreUsuario: string, emailUsuario: string, passUsuario: string, roles: string[]) {
        this.nombreUsuario = nombreUsuario;
        this.emailUsuario = emailUsuario;
        this.passUsuario = passUsuario;
        this.roles = roles;
    }
}