import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})

export class CompraService {
    url = 'http://localhost:8080/';
    constructor(private http: HttpClient) { }

    getItinerarioName(nombreHotel:any): Observable<any> {
        return this.http.get(this.url + 'itinerarioCompra/detalleItinerarioName/' + nombreHotel)
    }

    creoItinerario(creoItinerario: any): Observable<any> {
        return this.http.post(this.url + 'itinerarioCompra/crearItinerario', creoItinerario)
    }

    addActividad(itinerarioId: any, actividadId: any): Observable<any> {
        return this.http.post(this.url + 'itinerarioCompra/addActividad/' + actividadId + '/al/' + itinerarioId , null)
    }
}