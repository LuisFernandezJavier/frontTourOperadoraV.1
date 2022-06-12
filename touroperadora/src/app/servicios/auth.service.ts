import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtDto } from '../modelos/jwtDto';
import { LoginUsuario } from '../modelos/login';
import { NuevoUsuario } from '../modelos/nuevoUsuario';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    authURL = 'http://localhost:8080/auth';
    constructor(private httpClient: HttpClient) { }

    //registro de usuario
    public nuevoUsuario(nuevoUsuario: NuevoUsuario): Observable<any> {
        return this.httpClient.post(this.authURL + '/nuevoUsuario', nuevoUsuario);
    }

    // login del usuario
    public login(loginUsuario: LoginUsuario): Observable<JwtDto> {
        return this.httpClient.post<JwtDto>(this.authURL + '/login', loginUsuario);
    }
}