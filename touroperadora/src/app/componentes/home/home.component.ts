import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faCoffee, faEnvelope, faLocationDot, faPhone, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/servicios/auth.service';
import { ItinerarioService } from 'src/app/servicios/itinerario.service';
import { TokenService } from 'src/app/servicios/token.service';
import { LoginUsuario } from 'src/app/modelos/login';
import { ImagenService } from 'src/app/servicios/imagen.service';
import { homeItinerario } from 'src/app/modelos/homeItinerario';


declare var window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //iconos
  falocationdot = faLocationDot;
  faphone = faPhone;
  faenvelope = faEnvelope;
  faquestions = faQuestionCircle;
  imagenRecibo: any;
  logedo = false;

  //cierro iconos
  arrayItinerario: any;
  imagenLista: any = [];
  contador = -1;
  error: boolean = false;
  inicio = false;
  usuarioenvio:any;





  constructor(
    private tokenservice: TokenService,
    private itinerarioservice: ItinerarioService,
    private imagenservice: ImagenService
  ) {

  }

  ngOnInit(): void {
    this.inicio = false;
    this.getItinerarios();
    if (this.tokenservice.getToken()) {
      this.usuarioenvio = this.tokenservice.getUser()
      this.logedo = true;
    } else {
      this.logedo = false;
    }

  }

  getItinerarios() {
    this.itinerarioservice.itinerarios().subscribe((listaitinerarios: any) => {
      this.arrayItinerario = listaitinerarios;
      console.log(this.arrayItinerario);
      console.log(this.arrayItinerario[0].imagen);

      //recooro el array de itinerarios para traer la imagen descomprimida para mostrala
      for (let Itinerario of this.arrayItinerario) {

        console.log(this.contador);
        if (Itinerario.imagen != null) { // con este if me aseguro que no se muestren itinerarios sin imagenes  asignada
          this.imagenservice.getImage(Itinerario.imagen?.imagenId).subscribe((imagen: any) => {
            this.imagenRecibo = 'data:image/jpeg;base64,' + imagen?.imagenByte;
            const itinerarioHome = new homeItinerario(
              Itinerario.itinerarioId,
              Itinerario.nombreHotel,
              Itinerario.cordenadasHotel,
              Itinerario.ciudad,
              Itinerario.precioNoche,
              this?.imagenRecibo);
            //console.log(itinerarioHome)
            this.imagenLista.push(itinerarioHome);
            console.log(this.imagenLista);

          });

        }
      }

    });
  }

}



