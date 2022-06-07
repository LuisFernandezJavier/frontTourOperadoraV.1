import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { faDoorOpen, faUser } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { TokenService } from 'src/app/servicios/token.service';
import { ItinerarioService } from 'src/app/servicios/itinerario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Itinerario } from 'src/app/modelos/itinerario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { CompraService } from 'src/app/servicios/compra.service';
import { ImagenService } from 'src/app/servicios/imagen.service';
import swal from 'sweetalert';




declare var window: any;


@Component({
  selector: 'app-itinerario',
  templateUrl: './itinerario.component.html',
  styleUrls: ['./itinerario.component.css']
})
export class ItinerarioComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  //iconos
  usuario = faUser;
  salir = faDoorOpen;

  //cierro iconos

  //RELOJ
  private diaArray = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  private fecha = new Date();
  public hora: any;
  public minuto: any;
  public segundos: any;
  public ampm: any;
  public dia: any;
  //FIN RELOJ

  imagenRecibo: any;
  imagenId: any;
  modalCompra: any;
  usuarioenvio: any;
  objetoItinerario: any
  objItinerarioCompra: any;
  objItinerarioToCompra: any
  ID_ItinerarioCompra: any
  mapa!: mapboxgl.Map;
  mapContainer!: HTMLElement;
  inicio = false;
  iniciocontratar = false;
  contratar = false;
  actividadesForms: FormGroup;
  plazasForms: FormGroup;
  actividadesForms1 = new FormControl();
  usuarioObj: any
  TextoPlazas: any


  constructor(
    private tokenservice: TokenService,
    private itinerarioservice: ItinerarioService,
    private usuarioservice: UsuarioService,
    private compraservice: CompraService,
    private imagenservice: ImagenService,
    private router: Router,
    private aRouter: ActivatedRoute,
    private vb: FormBuilder
  ) {
    this.aRouter.params.subscribe(params => {
      console.log(params['_itinerarioId']);
    });

    this.actividadesForms = this.vb.group({
      actividades: ['', Validators.required]
    });

    this.plazasForms = this.vb.group({
      plazasContrato: ['', Validators.required],
    });
  }



  ngAfterViewInit(): void {

    this.mapContainer = (<HTMLElement>document.getElementById('mapbox'));
    this.mapa = new mapboxgl.Map({
      accessToken: environment.mapboxKEY,
      container: this.mapContainer,
      style: 'mapbox://styles/jluifer361/cl2dpniq5000f14o6swp5qou8',
      center: [-16.57454701628663, 28.220026474572805],
      zoom: 5
    });
  }
  itinerarioId = this.aRouter.snapshot.paramMap.get('_itinerarioId');

  ngOnInit(): void {
    this.modalCompra = new window.bootstrap.Modal(document.getElementById('modalCompra'));

    this.getUnItinerario();
    this.getUsuarioName();
    if (this.tokenservice.getToken()) {
      this.contratar = true;
    } else {
      this.iniciocontratar = true;
    }

    this.inicio = false;

    setInterval(() => {
      const fecha = new Date();
      this.updateFecha(fecha)
    }, 1000); //esto es el intervalo con el que vamos a llamar el metodo update fecha
    this.dia = this.diaArray[this.fecha.getDay()];

  }



  private updateFecha(fecha: Date): void {
    const horas = fecha.getHours();
    this.ampm = horas >= 12 ? 'PM' : 'AM';
    this.hora = horas % 12;
    this.hora = this.hora ? this.hora : 12; //cuando la hora es 00 asigno 12
    this.hora = this.hora < 10 ? '0' + this.hora : this.hora;

    const minutos = fecha.getMinutes();
    this.minuto = minutos < 10 ? '0' + minutos : minutos.toString();

    const segundos = fecha.getSeconds();
    this.segundos = segundos < 10 ? '0' + segundos : segundos.toString();

  }


  getUnItinerario() {


    this.itinerarioservice.unItinerario(this.itinerarioId).subscribe((objetoitinerario: any) => {
      this.objetoItinerario = objetoitinerario
      console.log(this.objetoItinerario);
      this.imagenId = this.objetoItinerario.imagen["imagenId"];
      console.log('id' + this.imagenId);

      this.imagenservice.getImage(this.imagenId).subscribe((imagen: any) => {
        this.imagenRecibo = 'data:image/jpeg;base64,' + imagen.imagenByte;

        console.log(this.imagenRecibo);
      });

      //console.log(base64);

    });
  }

  contrato() {

    // creo el itinerario de compra ###################################################
    let plazas = this.plazasForms.get('plazasContrato')?.value;
    console.log('id' + this.objetoItinerario.itinerarioId)
    this.itinerarioservice.unItinerario(this.objetoItinerario.itinerarioId).subscribe((itinerarioObj: any) => {
      console.log('plazas que elijo' + plazas)
      if (itinerarioObj.plazas >= plazas) {


        this.updatePlazas(this.objetoItinerario.itinerarioId);
        const creoItinerario: any = {
          ciudad: this.objetoItinerario.ciudad,
          cordenadasHotel: this.objetoItinerario.cordenadasHotel,
          nombreHotel: this.objetoItinerario.nombreHotel,
          precioNoche: this.objetoItinerario.precioNoche,
        }
        //guardo el itinerario de compra en la bd y relaciono con la actividad
        this.compraservice.creoItinerario(creoItinerario).subscribe((objetoitinerario: any) => {
          this.ID_ItinerarioCompra = objetoitinerario.itinerarioId;
          if (this.actividadesForms1.value != null) {
            let actividades: any = this.actividadesForms1.value
            console.log('Itinerario que relaciono ' + this.ID_ItinerarioCompra)
            console.log('actividades:' + actividades);
            actividades.forEach((element: any) => {
              this.compraservice.addActividad(this.ID_ItinerarioCompra, element.actividadId).subscribe((addActividad: any) => {
                console.log('actividad ' + element.actividadId + ' añadida al itinerario ' + this.ID_ItinerarioCompra)
              });
            })
          };
          // obtengo el usuario ################################################################################################3
          let Nombreusuario = this.tokenservice.getUser();
          this.usuarioservice.getUsuarioName(Nombreusuario).subscribe((objetoUsuario: any) => {
            this.usuarioObj = objetoUsuario
            console.log('id del usuario' + this.usuarioObj.usuarioId);
            // obtengo el usuario #########################################################################################################

            // asigno itinerario al usuario #########################################################################################################
            this.usuarioservice.addItinerario(this.ID_ItinerarioCompra, this.usuarioObj.usuarioId).subscribe((
              addItinerario: any) => {
              //console.log('itinerario' + this.ID_ItinerarioCompra + ' añadido al usuario ' + this.usuarioObj.usuarioId)
              this.router.navigateByUrl('/miPerfil/' + this.usuarioenvio);

            })

          });

        })
      }else {
        swal("Error", `No puede contratar ${plazas} plazas . Hay ${itinerarioObj.plazas} plazas disponibles`, "error")

        this.router.navigate(['/']);
      }
    })

    this.cierroModal();
    console.log(this.usuarioObj)
    //this.router.navigateByUrl('/miPerfil' , this.usuarioObj.nombreUsuario)
  }


  abroModal() {
    this.modalCompra.show();
  }

  cierroModal() {
    this.modalCompra.hide();
  }
  getUsuarioName() {
    this.usuarioenvio = this.tokenservice.getUser();
  }

  updatePlazas(itinerarioId: any) {
    let plazas = this.plazasForms.get('plazasContrato')?.value;
    console.log('id' + itinerarioId)
    this.itinerarioservice.unItinerario(itinerarioId).subscribe((itinerarioObj: any) => {
      console.log('plazas que elijo' + plazas)
      
        itinerarioObj.plazas = itinerarioObj.plazas - plazas;
        const plazasEnvio = {
          plazas: itinerarioObj.plazas
        }

        this.itinerarioservice.updatePlazas(itinerarioId, plazasEnvio).subscribe((respuesta: any) => {

        });
      
    });


  }

}



