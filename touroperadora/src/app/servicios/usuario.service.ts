import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";




@Injectable({
    providedIn: 'root'
})

export class UsuarioService {
    url = 'http://localhost:8080/';
    constructor(private http: HttpClient) { }

    usuarios(): Observable<any> {
        return this.http.get(this.url + 'usuario/lista')
    }

    getUsuarioName(usuarioNombre: any): Observable<any> {
        return this.http.get(this.url + 'usuario/detalleUsuario/' + usuarioNombre)
    }

    addItinerario(itinerarioId: any, usuarioId: any): Observable<any> {
        return this.http.post(this.url + 'usuario/addItinerario/' + itinerarioId + '/al/' + usuarioId, null)
    }

    eliminoUsuario(usuarioId: any): Observable<any> {
        return this.http.delete(this.url + 'usuario/eliminoUsuario/' + usuarioId)
    }
    editoUsuario(usuarioId: any, editoUsuario: any): Observable<any> {
        return this.http.put(this.url + 'usuario/editoUsuario/' + usuarioId, editoUsuario)
    }
    unUsuario(usuarioId: any): Observable<any> {
        return this.http.get(this.url + 'usuario/usuarioId/' + usuarioId)
    }
}