import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})



export class ImagenService {
  url = 'http://localhost:8080/';
  imagenBD: any;
  base64Data: any;
  recuperoRespuesta: any;
  httpClient: any;
  imagenId: any;
  constructor(private http: HttpClient) { }
  postImagen(archivo: any, nombreArchivo: any) {
    const datosImagen = new FormData();
    console.log('recibo' + archivo + nombreArchivo);
    datosImagen.append('imagenfile', archivo, nombreArchivo);
    this.http.post('http://localhost:8080/imagen/subida', datosImagen, { observe: 'response' })
      .subscribe((response: any) => {
      }
      );
  }

  getTodasImagenes(): Observable<any> {
    return this.http.get('http://localhost:8080/imagen/lista')
  }

  getImage(imagenId: any): Observable<any> {
    return this.http.get('http://localhost:8080/imagen/getImagen/' + imagenId)
  }

}