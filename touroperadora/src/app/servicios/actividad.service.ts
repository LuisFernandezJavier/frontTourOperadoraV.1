import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ActividadService {
    url = 'http://localhost:8080/';
    constructor(private http: HttpClient) { }

    actividades(): Observable<any> {
        return this.http.get(this.url + 'actividad/lista')
    }
    una_actividad(actividadId: any): Observable<any> {
        return this.http.get(this.url + 'actividad/detalleActividad/' + actividadId)
    }
    creoActividad(creoActividad: any): Observable<any> {
        return this.http.post(this.url + 'actividad/crearActividad', creoActividad)
    }
    eliminoActividad(actividadId: any): Observable<any> {
        return this.http.delete(this.url + 'actividad/eliminoActividad/' + actividadId)
    }
    editoActividad(actividadId: any, editoActividad: any): Observable<any> {
        return this.http.put(this.url + 'actividad/editoActividad/' + actividadId, editoActividad)
    }
}