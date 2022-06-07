import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ItinerarioService {
    url = 'http://localhost:8080/';
    constructor(private http: HttpClient) { }

    itinerarios(): Observable<any> {
        return this.http.get(this.url + 'itinerario/lista')
    }
    unItinerario(itinerarioId: any): Observable<any> {
        return this.http.get(this.url + 'itinerario/detalleItinerario/' + itinerarioId)
    }
    eliminoItinerario(itinerarioId: any): Observable<any> {
        return this.http.delete(this.url + 'itinerario/eliminoItinerario/' + itinerarioId)
    }
    creoItinerario(creoItinerario: any): Observable<any> {
        return this.http.post(this.url + 'itinerario/crearItinerario', creoItinerario)
    }
    addActividad(itinerarioId: any, actividadId: any): Observable<any> {
        return this.http.post(this.url + 'itinerario/addActividad/' + actividadId + '/al/' + itinerarioId , null)
    }
    removeActividad(itinerarioId: any, actividadId: any): Observable<any> {
        return this.http.post(this.url + 'itinerario/removeActividad/' + actividadId + '/del/' + itinerarioId , null)
    }
    addImagen(itinerarioId: any, imagenId: any): Observable<any> {
        return this.http.post(this.url + 'itinerario/addImagen/' + imagenId + '/al/' + itinerarioId , null)
    }
    removeImagen(itinerarioId: any): Observable<any> {
        return this.http.post(this.url + 'itinerario/deleteImagen/' + itinerarioId , null)
    }
    editoItinerario(itinerarioId: any, editoItinerario: any): Observable<any> {
        return this.http.put(this.url + 'itinerario/editoItinerario/' + itinerarioId, editoItinerario)
    }
    updatePlazas(itinerarioId: any, plazas: any): Observable<any> {
        return this.http.put(this.url + 'itinerario/asignoPlazas/' + itinerarioId, plazas)
    }
}