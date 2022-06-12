import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faCoffee, faEnvelope, faLocationDot, faPhone, faQuestionCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/servicios/auth.service';
import { ItinerarioService } from 'src/app/servicios/itinerario.service';
import { TokenService } from 'src/app/servicios/token.service';
import { LoginUsuario } from 'src/app/modelos/login';
import { ImagenService } from 'src/app/servicios/imagen.service';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PaginatePipe } from 'src/app/pipes/paginate.pipe';
import { ThisReceiver } from '@angular/compiler';


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
  fastar = faStar
  //cierro iconos
  imagenRecibo: any;
  logedo = false;
  admin = false;

  //paginacion
  page_size: number = 3;
  page_number: number = 1;
  pageSizeOptions = [3, 5, 10, 25, 50];
  //paginacion
  arrayItinerario: any = [];

  contador = -1;
  error: boolean = false;
  inicio = false;
  usuarioenvio: any;



  constructor(
    private tokenservice: TokenService,
    private itinerarioservice: ItinerarioService,
    private imagenservice: ImagenService
  ) { }

  ngOnInit(): void {

    this.inicio = false;

    if (this.tokenservice.getToken()) {
      this.usuarioenvio = this.tokenservice.getUser()
      this.logedo = true;
      if (this.tokenservice.getAuthorities().includes('ROLE_ADMIN')) {
        console.log("es admin")
        this.admin = true;
      }
    } else {
      this.logedo = false;
    }
  }

  ngAfterViewInit(): void {
    this.getItinerarios();

  }
  handlePage(e: PageEvent) {

    this.page_size = e.pageSize;
    this.page_number = e.pageIndex + 1;
  }

  getItinerarios() {
    this.itinerarioservice.itinerariosHome().subscribe((listaitinerarios: any) => {
      this.arrayItinerario = listaitinerarios;
      //recooro el array de itinerarios para traer la imagen descomprimida para mostrala

      for (let Itinerario2 of this.arrayItinerario) {
        this.imagenservice.getImage(Itinerario2.imagen?.imagenId).subscribe((imagen: any) => {
          this.imagenRecibo = 'data:image/jpeg;base64,' + imagen?.imagenByte;
          Itinerario2.base64 = this.imagenRecibo;
          Itinerario2.star = Math.round(Math.random() * (5 - 3) + (3))
        });
      }
    });
  }

}



